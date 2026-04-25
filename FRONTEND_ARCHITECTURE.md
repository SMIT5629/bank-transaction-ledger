# Frontend Architecture Guide

## High-Level Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Browser                            │
│                                                                   │
│  ┌──────────────┐                                               │
│  │   React App  │                                               │
│  │   (App.js)   │                                               │
│  └────────┬─────┘                                               │
│           │                                                      │
│  ┌────────▼──────────────────────────────┐                    │
│  │    Router (React Router v6)           │                    │
│  │  ├── /login (Public)                  │                    │
│  │  ├── /register (Public)               │                    │
│  │  ├── /dashboard (Protected)           │                    │
│  │  ├── /accounts (Protected)            │                    │
│  │  ├── /transactions (Protected)        │                    │
│  │  ├── /profile (Protected)             │                    │
│  │  └── /admin/dashboard (Admin Only)    │                    │
│  └────────┬──────────────────────────────┘                    │
│           │                                                      │
│  ┌────────▼────────────────────────┐                         │
│  │  AuthProvider (Context)         │                         │
│  │  - user                         │                         │
│  │  - authToken                    │                         │
│  │  - login()                      │                         │
│  │  - logout()                     │                         │
│  └────────┬────────────────────────┘                         │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────┘
            │
            │ API Calls
            │
┌───────────▼──────────────────────────────────────────────────┐
│                   Backend Server                              │
│            (Node.js/Express on port 5000)                     │
│                                                               │
│  ├── Authentication Routes (/auth)                           │
│  ├── Account Routes (/accounts)                              │
│  ├── Transaction Routes (/transactions)                      │
│  ├── Dashboard Routes (/dashboard)                           │
│  └── Admin Routes (/admin)                                   │
│                                                               │
└───────────┬──────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────┐
│                   Database                                    │
│            (MongoDB/PostgreSQL)                               │
│                                                               │
│  ├── Users Collection                                        │
│  ├── Accounts Collection                                     │
│  ├── Transactions Collection                                 │
│  └── Audit Logs Collection                                   │
│                                                               │
└────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.js
│
├─── AuthProvider
│    │
│    └─── Router
│         │
│         ├─── Public Routes
│         │    ├─── LoginPage
│         │    └─── RegisterPage
│         │
│         └─── Protected Routes (ProtectedRoute wrapper)
│              │
│              ├─── Layout (Sidebar + Navigation)
│              │    │
│              │    ├─── DashboardPage
│              │    ├─── AccountsPage
│              │    ├─── TransactionsPage
│              │    └─── ProfilePage
│              │
│              └─── AdminLayout
│                   └─── AdminDashboard
```

## Feature Module Structure

Each feature follows this pattern:

```
feature/
├── pages/
│   └── FeaturePage.js              # Main page component
│
├── components/
│   └── FeatureComponent.js         # Feature-specific components
│
├── services/
│   └── featureService.js           # API calls
│
└── styles/
    └── feature.css                 # Feature styles
```

## Data Flow Architecture

```
┌─────────────────────────────────────────┐
│        User Interaction (onClick)       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Component Event Handler               │
│   (handleSubmit, handleClick, etc.)     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Call Service Method                   │
│   (accountService.create(data))         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   API Client (apiClient)                │
│   - Adds auth token                     │
│   - Sets headers                        │
│   - Handles errors                      │
└────────────┬────────────────────────────┘
             │
             ▼ (HTTP Request)
┌─────────────────────────────────────────┐
│        Backend API                      │
│   (Node.js/Express)                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│        Database                         │
│   (Store/Update Data)                   │
└────────────┬────────────────────────────┘
             │
             ▼ (HTTP Response)
┌─────────────────────────────────────────┐
│   API Client Response Handler           │
│   - Parse response                      │
│   - Check for errors                    │
│   - Return data                         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Component Response Handler            │
│   (try-catch block)                     │
│   - Update state                        │
│   - Show success/error message          │
│   - Re-fetch data if needed             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│        Re-render Component              │
│   (useState triggers re-render)         │
└─────────────────────────────────────────┘
```

## Authentication State Management

```
App.js
  │
  └─── AuthProvider (AuthContext)
       │
       ├─── localStorage
       │    ├─── authToken (JWT)
       │    └─── userData (JSON)
       │
       └─── Context State
            ├─── user (Object)
            ├─── authToken (String)
            ├─── loading (Boolean)
            ├─── login() (Function)
            ├─── logout() (Function)
            └─── updateUser() (Function)

All Protected Components
  │
  └─── useAuth Hook
       ├─── Access user
       ├─── Access authToken
       ├─── Call login/logout
       └─── Update user
```

## API Interceptor Flow

```
┌──────────────────────────────────────┐
│   API Client (Axios Instance)        │
└──────────┬───────────────────────────┘
           │
           ├─── Request Interceptor
           │    ├─── Get token from localStorage
           │    ├─── Add to Authorization header
           │    └─── Send request
           │
           ├─── HTTP Request/Response
           │
           └─── Response Interceptor
                ├─── Check response status
                ├─── If 401 (Unauthorized)
                │    ├─── Remove token
                │    └─── Redirect to login
                └─── Otherwise pass response
```

## Protected Route Logic

```
<ProtectedRoute requiredRole="admin">
  <AdminComponent />
</ProtectedRoute>
       │
       ▼
1. Check if loading? 
   → Yes: Show loading spinner
   → No: Continue

2. Check if authenticated?
   → No: Redirect to /login
   → Yes: Continue

3. Check role requirement?
   → Role doesn't match: Redirect to /
   → Role matches: Continue

4. Render children component
```

## Authentication Flow Sequence

```
┌─────────────────────────────────────────────────────────┐
│ Sequence 1: User Login                                  │
└─────────────────────────────────────────────────────────┘

1. User enters email & password
   ↓
2. Click login button
   ↓
3. LoginPage calls authService.login(credentials)
   ↓
4. API sends POST /auth/login
   ↓
5. Backend validates & returns {token, user}
   ↓
6. LoginPage calls login(token, user)
   ↓
7. AuthProvider stores in localStorage
   ↓
8. AuthContext state updates
   ↓
9. Redirect to /dashboard
   ↓
10. Layout wrapper loads with user info


┌─────────────────────────────────────────────────────────┐
│ Sequence 2: Subsequent API Calls                        │
└─────────────────────────────────────────────────────────┘

1. Component calls service method
   ↓
2. Service uses apiClient
   ↓
3. Request interceptor adds token from localStorage
   ↓
4. Request sent with Authorization header
   ↓
5. Backend validates token & processes request
   ↓
6. Returns response with data
   ↓
7. Component receives data & updates state
   ↓
8. Component re-renders with new data


┌─────────────────────────────────────────────────────────┐
│ Sequence 3: Token Expiration                            │
└─────────────────────────────────────────────────────────┘

1. Component makes API call
   ↓
2. Backend returns 401 (Unauthorized)
   ↓
3. Response interceptor catches 401
   ↓
4. localStorage token is removed
   ↓
5. User redirected to /login
   ↓
6. User must log in again
```

## Styling System

```
Global CSS
├── CSS Variables (:root)
│   ├── Colors
│   │   ├── --primary-color
│   │   ├── --secondary-color
│   │   ├── --danger-color
│   │   ├── --success-color
│   │   ├── --text-primary
│   │   ├── --text-secondary
│   │   └── --border-color
│   ├── Shadows
│   │   ├── --shadow
│   │   ├── --shadow-md
│   │   └── --shadow-lg
│
├── Global Classes
│   ├── Typography (h1-h6, p, a)
│   ├── Form Elements (input, textarea, select)
│   ├── Buttons (.btn-primary, .btn-secondary, etc.)
│   ├── Cards (.card, .card-header)
│   ├── Alerts (.alert, .alert-success, etc.)
│   ├── Tables (table, th, td)
│   └── Utilities (.flex, .grid, .mb-*, etc.)
│
└── Feature Styles (Optional)
    ├── auth.css (Auth-specific)
    ├── dashboard.css (Layout & dashboard)
    ├── admin.css (Admin-specific)
    └── feature-specific.css
```

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│   Component/Service Method              │
│   try {                                 │
│     await apiCall()                     │
│   } catch (error) {                     │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   Error Object Structure                │
│   {                                     │
│     response: {                         │
│       status: 400/401/500,              │
│       data: {                           │
│         message: "Error message"        │
│       }                                 │
│     }                                   │
│   }                                     │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   Component Error Handler               │
│   - Set error state                     │
│   - Display error message               │
│   - Optional: Log to analytics          │
│   - Optional: Retry logic               │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   User Sees Error Alert                 │
│   (.alert-error class)                  │
└─────────────────────────────────────────┘
```

## State Management Pattern

```
Local Component State (useState)
├── Form inputs
│   ├── formData
│   └── formErrors
├── UI states
│   ├── loading
│   ├── error
│   ├── success
│   └── modal visibility
└── Data
    ├── items list
    └── selected item

Global Auth State (AuthContext)
├── user
│   ├── id
│   ├── firstName
│   ├── lastName
│   ├── email
│   └── role
├── authToken
└── loading
```

## Module Dependencies Map

```
App.js
│
├── AuthProvider (uses localStorage)
├── Router
│
├── LoginPage → authService → apiClient
├── RegisterPage → authService → apiClient
│
└── Protected Routes
    │
    ├── Layout (uses useAuth)
    │   ├── DashboardPage → dashboardService → apiClient
    │   ├── AccountsPage → accountService → apiClient
    │   ├── TransactionsPage → transactionService → apiClient
    │   └── ProfilePage → profileService → apiClient
    │
    └── AdminDashboard → adminService → apiClient

Shared Dependencies
├── useAuth (uses AuthContext)
├── apiClient (Axios instance)
└── ProtectedRoute (uses useAuth)
```

## Performance Considerations

### Code Splitting (with React.lazy)
```javascript
// Optional: Future optimization
const DashboardPage = React.lazy(() => 
  import('./features/dashboard/pages/DashboardPage')
);
```

### Caching Strategy
```javascript
// Services can implement caching
const cache = {};

export const cachedGet = async (key, fn) => {
  if (cache[key]) return cache[key];
  const data = await fn();
  cache[key] = data;
  return data;
};
```

### Optimizations Implemented
- Single API client for all requests
- Token auto-included in all requests
- Error handling at interceptor level
- Context API for state (no Redux overhead)
- CSS variables for easy theming

## Testing Strategy

```
Unit Tests
├── Services (mock API)
├── Hooks (mock context)
└── Utilities

Integration Tests
├── Components with services
├── Protected routes
└── Authentication flow

E2E Tests
├── Login flow
├── Create account
├── Create transaction
└── Admin operations
```

## Deployment Checklist

- [ ] Update API_BASE_URL to production
- [ ] Set environment variables
- [ ] Build project: `npm run build`
- [ ] Test build locally
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Set up custom domain
- [ ] Configure HTTPS
- [ ] Test all features on production
- [ ] Set up monitoring/error tracking
- [ ] Document deployment process

## Common Patterns

### Fetch Data on Mount
```javascript
useEffect(() => {
  fetchData();
}, []);
```

### Fetch Data on Dependency Change
```javascript
useEffect(() => {
  fetchData(filters);
}, [filters]);
```

### Modal Visibility Toggle
```javascript
const [showForm, setShowForm] = useState(false);
<button onClick={() => setShowForm(!showForm)}>
  Toggle
</button>
```

### Error & Success Messages
```javascript
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

try {
  await apiCall();
  setSuccess('Success message');
} catch (err) {
  setError('Error message');
}
```

## Quick Reference

| When to use | What to use |
|-----------|-----------|
| Global auth state | AuthContext + useAuth hook |
| API calls | Services + apiClient |
| Component state | useState |
| Side effects | useEffect |
| Style components | CSS files in feature folders |
| Protect routes | ProtectedRoute wrapper |
| Form handling | useState for form state |
| Async operations | try-catch with async/await |
