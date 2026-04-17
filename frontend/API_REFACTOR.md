# API Refactor Documentation

## Overview

The frontend API has been completely refactored to provide better error handling, more robust authentication management, and clearer separation of concerns. The key improvement is that authentication redirects now **only occur when the backend returns a 401 status code**, not based solely on client-side authentication state.

## Key Changes

### 1. New API Client (`src/lib/api-client.ts`)

A centralized API client that handles:
- Automatic token injection for authenticated requests
- Centralized error handling with proper 401 detection
- Network error detection
- Type-safe responses
- Consistent error formatting

**Key Features:**
- Only redirects to login on actual 401 responses from backend
- Automatically clears auth state on 401
- Dispatches custom events for error handling
- Provides detailed error information

### 2. Auth Error Hook (`src/hooks/useAuthError.ts`)

Custom hooks for handling authentication errors:
- `useAuthError()` - Listens for auth errors and manages redirect state
- `useAuthErrorHandler()` - Manually trigger auth errors

**Usage:**
```tsx
import { useAuthError } from '#/hooks/useAuthError'

function MyComponent() {
  const { authError, isRedirecting, clearAuthError } = useAuthError()
  
  if (isRedirecting) {
    return <LoadingSpinner />
  }
  
  // Component content
}
```

### 3. Updated ProtectedRoute (`src/components/ProtectedRoute.tsx`)

**Before:** Redirected based solely on authentication state
**After:** Only redirects on API 401 responses or role mismatches

**Key Changes:**
- No longer redirects just because `!isAuthenticated`
- Allows API calls to determine authentication status
- Provides better role-based access control
- Supports optional fallback content

**Usage:**
```tsx
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>

// With fallback
<ProtectedRoute requireAdmin fallback={<AccessDenied />}>
  <AdminDashboard />
</ProtectedRoute>
```

### 4. Refactored Services

All services have been refactored to use the new API client:

- `auth.service.ts` - Authentication operations
- `rooms.service.ts` - Room management
- `bookings.service.ts` - Booking operations
- `complaints.service.ts` - Complaint management
- `payments.service.ts` - Payment processing
- `invoices.service.ts` - Invoice management

**Service Pattern:**
```typescript
export async function getItems(): Promise<Item[]> {
  try {
    const response = await apiClient.get<Item[]>('/items')
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get items')
    }
    
    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get items')
  }
}
```

### 5. Simplified Axios Config (`src/lib/axios.ts`)

The axios configuration has been simplified to a basic instance. Complex error handling and auth logic are now handled by the API client.

### 6. Updated Root Route (`src/routes/__root.tsx`)

The root route now handles auth error events and manages the redirect state across the entire application.

## How It Works

### Authentication Flow

1. **Initial Load:**
   - AuthProvider checks localStorage for existing auth data
   - If found, sets authenticated state
   - Application renders without immediate redirect

2. **API Request:**
   - API client automatically adds token to headers
   - Request is made to backend
   - **Only 401 response triggers redirect**

3. **401 Handling:**
   - API client detects 401 status
   - Clears auth state from localStorage
   - Dispatches 'auth-error' event
   - Triggers redirect to login page
   - Stores current URL for redirect after login

### Error Handling

All errors are now handled consistently:

```typescript
try {
  const data = await someApiCall()
} catch (error: any) {
  // Error is already formatted by API client
  console.error(error.message)
  // error.status, error.code, error.details available
}
```

## Migration Guide

### For Existing Components

**Before:**
```tsx
function MyComponent() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />
  }
  
  // Component logic
}
```

**After:**
```tsx
function MyComponent() {
  const { isAuthenticated } = useAuth()
  
  // Don't redirect based on state - let API calls handle it
  // Component logic will make API calls
  // If 401 returned, automatic redirect will occur
}
```

### For API Calls

**Before:**
```typescript
export async function getData() {
  const response = await axios.get('/data')
  if (!response.data.success) {
    throw new Error('Failed')
  }
  return response.data.data
}
```

**After:**
```typescript
export async function getData() {
  const response = await apiClient.get<Data[]>('/data')
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed')
  }
  return response.data
}
```

## Benefits

1. **Better User Experience:** No unnecessary redirects when tokens are valid
2. **More Robust:** Only redirects when backend confirms authentication failure
3. **Cleaner Code:** Centralized error handling reduces repetitive code
4. **Type Safe:** Better TypeScript support with typed responses
5. **Maintainable:** Clear separation of concerns
6. **Debuggable:** Consistent error formatting makes debugging easier

## Testing

To test the new authentication flow:

1. **Valid Token:**
   - Login with valid credentials
   - Navigate to protected routes
   - Make API calls
   - Should work without redirects

2. **Expired Token:**
   - Use an expired token in localStorage
   - Make an API call
   - Should receive 401 and redirect to login

3. **No Token:**
   - Clear localStorage
   - Navigate to protected routes
   - Should allow access until API call returns 401

## Troubleshooting

**Issue:** Still getting redirected immediately

**Solution:** 
- Check that you're using the new API client in services
- Ensure ProtectedRoute is updated
- Verify API client is being imported correctly

**Issue:** Not redirecting on 401

**Solution:**
- Check browser console for errors
- Verify API client is handling 401 correctly
- Ensure useAuthError hook is being used in root

**Issue:** Type errors after refactor

**Solution:**
- Update service return types to match new ApiResponse format
- Check that apiClient is imported instead of axios
- Verify type definitions are correct

## Future Improvements

- [ ] Add request retry logic for temporary failures
- [ ] Implement request cancellation for improved performance
- [ ] Add request/response logging in development mode
- [ ] Create API hook for React Query integration
- [ ] Add request throttling/debouncing
- [ ] Implement offline detection and queuing