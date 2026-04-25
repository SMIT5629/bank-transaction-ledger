# Frontend Project Structure Overview

## Complete Directory Tree

```
frontend/
├── public/
│   └── index.html                    # HTML entry point
│
├── src/
│   ├── features/                     # Feature-based modules
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── RegisterPage.js
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   └── styles/
│   │   │       └── auth.css
│   │   │
│   │   ├── dashboard/                # User dashboard feature
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.js
│   │   │   ├── components/
│   │   │   │   └── Layout.js
│   │   │   ├── services/
│   │   │   │   └── dashboardService.js
│   │   │   └── styles/
│   │   │       └── dashboard.css
│   │   │
│   │   ├── accounts/                 # Account management feature
│   │   │   ├── pages/
│   │   │   │   └── AccountsPage.js
│   │   │   ├── services/
│   │   │   │   └── accountService.js
│   │   │   └── styles/ (inherits from dashboard)
│   │   │
│   │   ├── transactions/             # Transaction management feature
│   │   │   ├── pages/
│   │   │   │   └── TransactionsPage.js
│   │   │   ├── services/
│   │   │   │   └── transactionService.js
│   │   │   └── styles/ (inherits from dashboard)
│   │   │
│   │   ├── admin/                    # Admin dashboard feature
│   │   │   ├── pages/
│   │   │   │   └── AdminDashboard.js
│   │   │   ├── services/
│   │   │   │   └── adminService.js
│   │   │   └── styles/
│   │   │       └── admin.css
│   │   │
│   │   └── profile/                  # User profile feature
│   │       ├── pages/
│   │       │   └── ProfilePage.js
│   │       ├── services/
│   │       │   └── profileService.js
│   │       └── styles/ (inherits from dashboard)
│   │
│   ├── shared/                       # Shared utilities & components
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with interceptors
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global auth state
│   │   ├── hooks/
│   │   │   └── useAuth.js            # Auth hook
│   │   └── components/
│   │       └── ProtectedRoute.js     # Route protection wrapper
│   │
│   ├── styles/
│   │   └── global.css                # Global styles & design system
│   │
│   ├── App.js                        # Main app with routing
│   └── index.js                      # Entry point
│
├── .gitignore
├── package.json
├── README.md
└── FRONTEND_SETUP.md                 # This setup guide
```

## Feature-Based Architecture Benefits

### 1. **Modularity**
Each feature is self-contained and independent. You can work on one feature without affecting others.

### 2. **Scalability**
Easy to add new features. Just create a new folder under `features/` with the same structure.

### 3. **Maintainability**
Related code is grouped together - services, pages, and styles are in one place.

### 4. **Reusability**
Shared utilities are centralized in the `shared/` folder and can be used across all features.

### 5. **Team Collaboration**
Team members can work on different features in parallel without merge conflicts.

## Feature Breakdown

### 🔐 Auth Feature
**Purpose**: User authentication and registration

**Components**:
- `LoginPage.js` - Login form
- `RegisterPage.js` - Registration form
- `authService.js` - Auth API calls
- `auth.css` - Auth-specific styling

**API Endpoints Used**:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- PUT /auth/profile
- POST /auth/change-password

---

### 📊 Dashboard Feature
**Purpose**: User overview and statistics

**Components**:
- `DashboardPage.js` - Main dashboard with stats
- `Layout.js` - Sidebar layout for all pages
- `dashboardService.js` - Dashboard API calls
- `dashboard.css` - Layout and dashboard styles

**API Endpoints Used**:
- GET /dashboard/stats
- GET /dashboard/recent-transactions
- GET /dashboard/account-summary

---

### 💳 Accounts Feature
**Purpose**: Account management

**Components**:
- `AccountsPage.js` - List and manage accounts
- `accountService.js` - Account API calls

**API Endpoints Used**:
- GET /accounts
- GET /accounts/:id
- POST /accounts
- PUT /accounts/:id
- DELETE /accounts/:id
- GET /accounts/:id/balance

---

### 💰 Transactions Feature
**Purpose**: Transaction management and history

**Components**:
- `TransactionsPage.js` - List and create transactions
- `transactionService.js` - Transaction API calls

**API Endpoints Used**:
- GET /transactions
- GET /transactions/:id
- POST /transactions
- PUT /transactions/:id
- DELETE /transactions/:id
- GET /transactions/stats

---

### 👤 Profile Feature
**Purpose**: User profile management

**Components**:
- `ProfilePage.js` - Edit profile and change password
- `profileService.js` - Profile API calls

**API Endpoints Used**:
- GET /auth/profile
- PUT /auth/profile
- POST /auth/change-password

---

### ⚙️ Admin Feature
**Purpose**: System administration and monitoring

**Components**:
- `AdminDashboard.js` - Admin overview with tabbed interface
- `adminService.js` - Admin API calls
- `admin.css` - Admin-specific styling

**API Endpoints Used**:
- GET /admin/users
- GET /admin/accounts
- GET /admin/transactions
- GET /admin/stats
- GET /admin/audit-logs

---

## Shared Utilities

### `api.js`
Central API client using Axios with:
- Base URL configuration
- Request interceptors (adds auth token)
- Response interceptors (handles 401 errors)

### `AuthContext.js`
Global authentication state management with:
- User information
- Auth token
- Login/logout methods
- User update method

### `useAuth.js`
Custom hook to access auth context anywhere in the app

### `ProtectedRoute.js`
Route wrapper that:
- Checks if user is authenticated
- Enforces role-based access control
- Redirects to login if unauthorized

## Styling Architecture

### Design System (global.css)
CSS custom properties for consistent theming:
- Primary colors
- Text colors
- Background colors
- Shadow effects
- Spacing scales

### Component Styles
Each feature has its own CSS file with:
- Component-specific styles
- Layout styles
- Responsive design
- Animations

### Utility Classes
Global utility classes for quick styling:
- `.flex`, `.flex-between`, `.flex-center`
- `.grid`, `.grid-2`, `.grid-3`
- `.mb-*`, `.mt-*`, `.p-*` (margin/padding)
- `.text-center`, `.text-right`
- `.badge`, `.badge-success`, etc.

## Authentication Flow

```
1. User visits /login or /register
   ↓
2. Submit credentials to backend
   ↓
3. Backend returns JWT token + user data
   ↓
4. Frontend stores token in localStorage
   ↓
5. AuthContext updates global state
   ↓
6. User redirected to /dashboard
   ↓
7. Token automatically added to all API requests via interceptor
   ↓
8. Protected routes render wrapped components
   ↓
9. On logout, token removed and user redirected to /login
   ↓
10. On 401 error, token cleared and redirect to /login
```

## Adding a New Feature

### Step 1: Create folder structure
```bash
mkdir -p src/features/newfeature/{pages,services,styles,components}
```

### Step 2: Create service file
```javascript
// src/features/newfeature/services/newfeatureService.js
import apiClient from '../../../shared/services/api';

export const newfeatureService = {
  getAll: () => apiClient.get('/endpoint'),
  create: (data) => apiClient.post('/endpoint', data),
  update: (id, data) => apiClient.put(`/endpoint/${id}`, data),
  delete: (id) => apiClient.delete(`/endpoint/${id}`),
};
```

### Step 3: Create page component
```javascript
// src/features/newfeature/pages/NewFeaturePage.js
import React, { useEffect, useState } from 'react';
import { newfeatureService } from '../services/newfeatureService';

const NewFeaturePage = () => {
  // Component logic here
};

export default NewFeaturePage;
```

### Step 4: Create CSS file
```css
/* src/features/newfeature/styles/newfeature.css */
.newfeature-container {
  /* Styles here */
}
```

### Step 5: Add route in App.js
```javascript
import NewFeaturePage from './features/newfeature/pages/NewFeaturePage';

<Route
  path="/newfeature"
  element={
    <ProtectedRoute>
      <Layout>
        <NewFeaturePage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### Step 6: Add navigation link in Layout.js
```javascript
<li>
  <Link to="/newfeature">
    <span className="sidebar-icon">🎯</span>
    New Feature
  </Link>
</li>
```

## Key Concepts

### State Management
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use `AuthContext` for authentication
- **Server State**: Use services to fetch from API

### Error Handling
- Services return promises
- Components handle errors with try-catch
- Display errors to users in error alerts

### Loading States
- Components track loading state
- Show loading spinner while fetching
- Disable buttons while processing

### Responsive Design
- Mobile-first approach
- CSS media queries in styles
- Flexbox for most layouts
- Grid for complex 2D layouts

## Performance Tips

1. **Code Splitting**: Features are naturally split for lazy loading
2. **API Calls**: Use `useEffect` with proper dependencies
3. **Caching**: Add caching logic in services if needed
4. **Images**: Optimize images before adding to project
5. **Bundle**: Use production build for deployment

## Security Considerations

1. **Token Storage**: Stored in localStorage (consider httpOnly cookies for higher security)
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure properly on backend
4. **Input Validation**: Validate inputs on frontend
5. **XSS Protection**: React automatically escapes JSX values
6. **CSRF**: Include CSRF tokens if needed from backend

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Verify backend is running on localhost:5000
4. Test login flow
5. Explore features in the app
6. Add more features as needed
7. Build for production: `npm run build`
