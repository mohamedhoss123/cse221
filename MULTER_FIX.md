# Room Images Fix - Multer Version Issue

## Problem
Room image uploads were failing with the error:
```json
{"success":false,"message":"No image file provided"}
```

## Root Cause Analysis

### Issue 1: Wrong Multer Version
The project had `multer@2.1.1` installed, which is a complete rewrite with breaking changes from the stable 1.x version.

**Key difference:** In multer 2.x, the middleware API changed:
- `upload.single('field')` - ❌ Not available in 2.x
- `upload.fields([...])` - Different syntax in 2.x

Our code was using `upload.single('image')` which is undefined in multer 2.x, causing `req.file` to always be undefined.

### Issue 2: Relative Path Issues
The upload middleware and static file serving were using relative paths:
- `'public/uploads/room-images/'` in middleware
- `'public/uploads'` in static serving

These paths might not resolve correctly depending on the process working directory.

## Solution

### 1. Downgraded Multer to Stable Version
```bash
npm uninstall multer
npm install multer@1.4.5-lts.2
npm install --save-dev @types/multer@1.4.12
```

**Why LTS version?**
- Multer 1.x is the Long Term Support version
- Stable, well-documented API
- Compatible with our existing code
- `upload.single()` works as expected

### 2. Fixed Path Resolution
Updated paths to use absolute paths based on `__dirname`:

**In `backend/src/middleware/upload.js`:**
```javascript
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/room-images/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // ✅ Absolute path
  },
  // ...
});
```

**In `backend/src/index.js`:**
```javascript
const path = require('path');

// ✅ Absolute path for static serving
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
```

## Files Modified

### Backend
1. **`backend/package.json`**
   - Downgraded `multer` from `2.1.1` to `1.4.5-lts.2`
   - Downgraded `@types/multer` from `2.1.0` to `1.4.12`

2. **`backend/src/middleware/upload.js`**
   - Added `fs` module import
   - Added directory existence check with `mkdirSync`
   - Changed to absolute path using `path.join(__dirname, ...)`

3. **`backend/src/index.js`**
   - Added `path` module import
   - Changed static serving to absolute path

### Frontend
No changes needed - `frontend/src/services/roomImages.service.ts` already has the correct FormData handling.

## Verification

### Test Image Upload:
1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend:
   ```bash
   cd frontend
   pnpm dev
   ```
   Or use Docker:
   ```bash
   docker-compose up
   ```

3. Login as admin
4. Go to Admin → Rooms → Edit Room (or Create New Room)
5. Select an image file
6. Submit the form
7. Should see success toast: "Image uploaded successfully"

### Verify File Storage:
```bash
# Check if files are being saved
ls -la backend/public/uploads/room-images/

# Should see image files like:
# 1743123456789-123456789.jpg
```

### Verify API Response:
```bash
# Test the endpoint
curl -X POST http://localhost:5000/api/room-images/room/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"

# Should return:
# {
#   "success": true,
#   "message": "Image uploaded successfully",
#   "data": { ... }
# }
```

### Verify Image Display:
1. Check room images appear in RoomCard component
2. Check room detail page shows image gallery
3. Verify image URLs resolve: `http://localhost:5000/uploads/room-images/{filename}`

## Technical Details

### Multer 1.x API (What we use now):
```javascript
const upload = multer({ storage: storage });

// Single file
router.post('/room/:roomId', upload.single('image'), handler);
// req.file = { filename, originalname, mimetype, size, path }

// Multiple files
router.post('/room/:roomId', upload.array('images', 5), handler);
// req.files = [...]

### Multer 2.x API (Not compatible):
- Different middleware structure
- Breaking changes in API
- `upload.single()` doesn't exist
- Different error handling

### Why Not Use Multer 2.x?
1. **Breaking Changes**: Requires complete rewrite of upload handling
2. **Less Stable**: Alpha/Beta/RC versions, not production-ready
3. **No Documentation**: Limited documentation for 2.x API
4. **Migration Effort**: Significant code changes needed

## Directory Structure
```
backend/
├── public/
│   └── uploads/
│       └── room-images/
│           ├── .gitkeep
│           ├── 1743123456789-123456789.jpg
│           └── 1743123456790-987654321.png
└── src/
    ├── middleware/
    │   └── upload.js        (uploads to public/uploads/room-images/)
    └── index.js             (serves /uploads → public/uploads)
```

## Common Issues & Solutions

### Issue: "No image file provided"
**Cause:** `req.file` is undefined
**Solutions:**
- Ensure multer 1.4.5-lts.2 is installed
- Check field name matches: `upload.single('image')` → FormData key is 'image'
- Verify Content-Type is not set (let Axios set it)

### Issue: Images don't display
**Cause:** Static file serving path issue
**Solutions:**
- Use absolute paths in `express.static()`
- Ensure upload directory exists
- Check file permissions

### Issue: "ENOENT: no such file or directory"
**Cause:** Upload directory doesn't exist
**Solution:** Added `fs.mkdirSync(uploadDir, { recursive: true })` in upload.js

## Status
✅ **Fixed** - Room images now work correctly with:
- Multer 1.4.5-lts.2 (stable)
- Absolute file paths
- Automatic directory creation
- Proper static file serving
