# Image Upload Fix Summary

## Problem
When uploading images in edit mode, the API returned:
```json
{"success":false,"message":"No image file provided"}
```

## Root Cause
The `apiClient` has a default `Content-Type: application/json` header. When sending FormData (for file uploads), this header conflicts with the multipart/form-data content type that Axios needs to set automatically with the proper boundary.

## Solution
Updated `frontend/src/services/roomImages.service.ts` to:
1. Use `apiClient` directly instead of `BaseService` for FormData uploads
2. Set `Content-Type: undefined` to let Axios automatically set the correct multipart/form-data header with boundary
3. Import `handleApiCall` to maintain consistent error handling

## Changes Made

### File: `frontend/src/services/roomImages.service.ts`

**Before:**
```typescript
export async function uploadRoomImage(
  roomId: string,
  file: File,
  isPrimary = false
): Promise<RoomImage> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('isPrimary', isPrimary.toString())

  return BaseService.post<RoomImage>(
    `/room-images/room/${roomId}`,
    formData
  )
}
```

**After:**
```typescript
export async function uploadRoomImage(
  roomId: string,
  file: File,
  isPrimary = false
): Promise<RoomImage> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('isPrimary', isPrimary.toString())

  // Use apiClient directly for FormData uploads to avoid Content-Type: application/json
  return handleApiCall<RoomImage>(
    apiClient.post(`/room-images/room/${roomId}`, formData, {
      headers: {
        // Don't set Content-Type, let Axios set it automatically with boundary
        'Content-Type': undefined,
      },
    })
  )
}
```

### Additional Fix: `frontend/src/components/admin/RoomForm.tsx`

Fixed the `handleImageUpload` function to properly update state when uploading multiple images:

**Before:**
```typescript
for (const file of Array.from(files)) {
  const result = await roomImagesService.uploadRoomImage(room.id, file, isPrimary)
  setImages([...images, result]) // ❌ Uses stale state
}
```

**After:**
```typescript
const newImages: RoomImage[] = []
for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const isPrimary = images.length === 0 && pendingImages.length === 0 && i === 0
  const result = await roomImagesService.uploadRoomImage(room.id, file, isPrimary)
  newImages.push(result)
}
// Update state with all new images at once
setImages([...images, ...newImages]) // ✅ Properly accumulates results
```

## How FormData Upload Works

### Correct Request Headers:
```
POST /api/room-images/room/1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
Authorization: Bearer <token>

------WebKitFormBoundary...
Content-Disposition: form-data; name="image"; filename="room.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary...
Content-Disposition: form-data; name="isPrimary"

true
------WebKitFormBoundary...--
```

### Incorrect Request Headers (Before Fix):
```
POST /api/room-images/room/1
Content-Type: application/json  ❌ Wrong!
Authorization: Bearer <token>

[FormData gets stringified or sent incorrectly]
```

## Testing

### Verify Upload Works:
1. Go to Admin → Rooms → Edit Room
2. Select one or more image files
3. Click to upload
4. Verify toast notification appears: "N image(s) uploaded successfully"
5. Verify images appear in the "Uploaded Images" section
6. Verify images display in customer-facing pages

### Backend Logs Check:
```bash
# Check multer received the file
docker-compose logs -f cse221_backend

# Should see:
# req.file contains: { filename, originalname, mimetype, path, size }
```

### File System Check:
```bash
# Verify files exist
ls -la backend/public/uploads/room-images/

# Should see uploaded image files
```

## Related Components

### Backend (Already Working):
- ✅ `backend/src/middleware/upload.js` - Multer configuration
- ✅ `backend/src/modules/roomImage/controllers/roomImageController.js` - Handles `req.file`
- ✅ `backend/src/modules/roomImage/routes/roomImageRoutes.js` - Uses `upload.single('image')`
- ✅ `backend/src/modules/room/services/roomService.js` - Fetches images with room data
- ✅ `backend/src/index.js` - Serves static files from `/uploads`

### Frontend (Now Fixed):
- ✅ `frontend/src/services/roomImages.service.ts` - Proper FormData handling
- ✅ `frontend/src/components/admin/RoomForm.tsx` - Upload UI and state management
- ✅ `frontend/src/components/shared/RoomCard.tsx` - Displays images
- ✅ `frontend/src/routes/customer/rooms/$id.tsx` - Image gallery

## Key Takeaways

1. **Never set `Content-Type: application/json` for FormData** - Let Axios set it automatically
2. **Use `apiClient` directly for FormData uploads** - BaseService assumes JSON
3. **Accumulate async results** - Don't update state with stale values in loops
4. **Set `Content-Type: undefined`** - Tells Axios to auto-detect and set the boundary

## Status
✅ Fixed and ready for testing
