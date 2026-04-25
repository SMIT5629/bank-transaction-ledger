# Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Backend Connection

Make sure your backend is running on `http://localhost:5000`

If your backend is on a different port, update the API base URL in:
```
frontend/src/shared/services/api.js
```

Change this line:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Project Architecture

This frontend follows a **feature-based architecture**:

### Features (Main Modules)
Each feature is self-contained with its own:
- **pages/** - Page components
- **services/** - API calls
- **styles/** - Feature-specific CSS
- **components/** - Feature-specific components

### Shared Resources
- **services/api.js** - Axios instance with interceptors
- **context/AuthContext.js** - Global authentication state
- **hooks/useAuth.js** - Custom hook to access auth
- **components/ProtectedRoute.js** - Route protection wrapper

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is sent with all API requests via interceptor
5. On unauthorized (401), user is redirected to login

## Available Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Eject (one-way operation, not recommended)
npm run eject
```

## API Integration

All API calls use the `apiClient` from `src/shared/services/api.js`

### Example Service Pattern:
```javascript
import apiClient from '../../../shared/services/api';

export const exampleService = {
  getAll: () => {
    return apiClient.get('/endpoint');
  },

  create: (data) => {
    return apiClient.post('/endpoint', data);
  },

  update: (id, data) => {
    return apiClient.put(`/endpoint/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`/endpoint/${id}`);
  },
};
```

## Using Authentication

```javascript
import { useAuth } from '../../../shared/hooks/useAuth';

function MyComponent() {
  const { user, authToken, login, logout } = useAuth();

  // Use user, authToken, login, logout as needed
}
```

## Protected Routes

Routes are protected using the ProtectedRoute wrapper:

```javascript
<Route
  path="/protected"
  element={
    <ProtectedRoute requiredRole="admin">
      <ProtectedComponent />
    </ProtectedRoute>
  }
/>
```

## Adding New Features

1. Create feature folder: `src/features/featureName/`
2. Add subdirectories:
   - `pages/` - Page components
   - `services/` - API service
   - `styles/` - CSS files
   - `components/` (optional) - Feature components

3. Create service file with API calls
4. Create page component that uses the service
5. Add routes in `App.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS is properly configured on backend
- Verify API base URL in `api.js`

### Login Not Working
- Ensure backend endpoints match expectations
- Check network tab in browser DevTools
- Verify token is being stored in localStorage

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check CSS file is imported in App.js

## Development Tips

- Use React DevTools browser extension
- Use Redux DevTools for state management (if added)
- Check browser console for errors
- Use network tab to debug API calls
- localStorage values can be inspected in DevTools

## Production Deployment

1. Build the app: `npm run build`
2. The build folder contains optimized production files
3. Deploy the build folder to your hosting service
4. Update API_BASE_URL to production backend URL before building
5. Set proper environment variables if needed

## Styling Guide

The project uses vanilla CSS with CSS variables for theming.

### Color Variables (in global.css):
```css
:root {
  --primary-color: #1e40af;
  --secondary-color: #0f766e;
  --danger-color: #dc2626;
  --success-color: #16a34a;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}
```

### Using Variables:
```css
.button {
  background-color: var(--primary-color);
  color: var(--text-primary);
}
```

## Need Help?

- Check the README.md for detailed documentation
- Review example components in features/
- Check backend API documentation
- Inspect network requests in browser DevTools
