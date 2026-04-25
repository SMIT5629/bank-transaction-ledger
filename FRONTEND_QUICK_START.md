# Frontend Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app opens at `http://localhost:3000`

### 3. Make Sure Backend is Running
Backend should be running at `http://localhost:5000`

### 4. Test the App
- Navigate to the login page
- Register a new account or login with existing credentials
- Explore the dashboard and features

## 📁 Project Structure (Simple Version)

```
frontend/src/
├── features/        # Main features (auth, dashboard, etc.)
├── shared/         # Shared utilities (api, auth, hooks)
├── styles/         # Global CSS
├── App.js          # Main app with routing
└── index.js        # Entry point
```

## 🔗 Key Files Location

| Task | File |
|------|------|
| Add login/register | `src/features/auth/pages/` |
| Change API URL | `src/shared/services/api.js` |
| Add global styles | `src/styles/global.css` |
| Access user data | Use `useAuth()` hook |
| Create new feature | Create folder in `src/features/` |
| Protect a route | Wrap with `<ProtectedRoute>` |

## 🎯 Common Tasks

### Access Current User
```javascript
import { useAuth } from '../../../shared/hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();
  console.log(user.firstName); // "John"
  console.log(user.email);     // "john@example.com"
}
```

### Make API Call
```javascript
import apiClient from '../../../shared/services/api';

const data = await apiClient.get('/endpoint');
const response = await apiClient.post('/endpoint', payload);
```

### Create Service
```javascript
import apiClient from '../../../shared/services/api';

export const myService = {
  getAll: () => apiClient.get('/items'),
  create: (data) => apiClient.post('/items', data),
  update: (id, data) => apiClient.put(`/items/${id}`, data),
  delete: (id) => apiClient.delete(`/items/${id}`),
};
```

### Add Error Handling
```javascript
try {
  const response = await myService.getAll();
  setData(response.data);
} catch (err) {
  setError(err.response?.data?.message || 'Error occurred');
}
```

### Show Loading State
```javascript
const [loading, setLoading] = useState(false);

if (loading) return <div>Loading...</div>;
```

### Create Form
```javascript
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await myService.create(formData);
};

return (
  <form onSubmit={handleSubmit}>
    <input 
      name="name" 
      value={formData.name} 
      onChange={handleChange}
    />
    <input 
      name="email" 
      value={formData.email} 
      onChange={handleChange}
    />
    <button type="submit">Submit</button>
  </form>
);
```

## 🎨 Styling Quick Ref

### Add a Button
```jsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-danger">Danger</button>
```

### Add a Card
```jsx
<div className="card">
  <div className="card-header">
    <h2>Title</h2>
  </div>
  {/* Content */}
</div>
```

### Add a Grid
```jsx
<div className="grid grid-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Add Spacing
```jsx
<div className="mt-4 mb-2 p-3">Content</div>
```

### Add Badge
```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-danger">Inactive</span>
```

### Add Alert
```jsx
<div className="alert alert-success">Success!</div>
<div className="alert alert-error">Error!</div>
```

## 🔐 Authentication

### Login User
```javascript
import { useAuth } from '../shared/hooks/useAuth';
import { authService } from '../features/auth/services/authService';

const { login } = useAuth();
const response = await authService.login({ email, password });
login(response.data.token, response.data.user);
```

### Logout User
```javascript
const { logout } = useAuth();
logout();
// User redirected to /login automatically
```

### Check if User is Admin
```javascript
const { user } = useAuth();
if (user.role === 'admin') {
  // Show admin options
}
```

## 📡 API Reference

### Authentication
```
POST   /api/auth/register      - Register user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
POST   /api/auth/logout        - Logout
PUT    /api/auth/profile       - Update profile
POST   /api/auth/change-password - Change password
```

### Accounts
```
GET    /api/accounts           - Get all accounts
POST   /api/accounts           - Create account
GET    /api/accounts/:id       - Get account
PUT    /api/accounts/:id       - Update account
DELETE /api/accounts/:id       - Delete account
```

### Transactions
```
GET    /api/transactions       - Get all transactions
POST   /api/transactions       - Create transaction
GET    /api/transactions/:id   - Get transaction
PUT    /api/transactions/:id   - Update transaction
DELETE /api/transactions/:id   - Delete transaction
```

### Dashboard
```
GET    /api/dashboard/stats    - Get stats
GET    /api/dashboard/recent-transactions - Recent trans
GET    /api/dashboard/account-summary - Account summary
```

### Admin
```
GET    /api/admin/users        - Get all users
GET    /api/admin/accounts     - Get all accounts
GET    /api/admin/transactions - Get all transactions
GET    /api/admin/stats        - Get system stats
```

## 🐛 Debugging

### Check User State
```javascript
const { user, authToken, loading } = useAuth();
console.log('User:', user);
console.log('Token:', authToken);
console.log('Loading:', loading);
```

### Check API Response
```javascript
try {
  const response = await myService.getAll();
  console.log('Success:', response.data);
} catch (err) {
  console.log('Error:', err.response?.data);
}
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('authToken')
localStorage.getItem('userData')
```

### Check Network Requests
- Open DevTools (F12)
- Go to Network tab
- Filter by "XHR" or "fetch"
- Click on request to see details

## ⚡ Performance Tips

1. **Avoid unnecessary re-renders**
   - Use proper dependencies in useEffect
   - Memoize expensive computations

2. **Optimize API calls**
   - Don't call API on every keystroke
   - Use debouncing for search
   - Cache data when possible

3. **Code splitting**
   - Each feature is already modular
   - Can add lazy loading if needed

4. **Bundle size**
   - Check: `npm run build`
   - Analyze with webpack-bundle-analyzer

## 🚨 Common Issues & Fixes

### "Cannot GET /dashboard"
- Make sure backend is running on port 5000
- Check API_BASE_URL in `src/shared/services/api.js`

### Login not working
- Check network tab for errors
- Verify endpoint returns token and user
- Check localStorage for authToken

### Routes not working
- Make sure route is defined in App.js
- Check path spelling matches exactly
- Verify ProtectedRoute wrapper if needed

### Styles not applying
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check CSS file is imported

### Token not persisting
- Check localStorage in DevTools
- Verify login is calling `login()` hook
- Check token expiration on backend

## 📚 Learn More

- **Architecture**: Read `FRONTEND_ARCHITECTURE.md`
- **Setup Details**: Read `FRONTEND_SETUP.md`
- **File Structure**: Read `FRONTEND_STRUCTURE.md`
- **API Docs**: Check backend repository

## 🚢 Deploy

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Update API URL**
   Change `API_BASE_URL` in `src/shared/services/api.js`

3. **Deploy build folder**
   - Vercel: `vercel --prod`
   - Netlify: Drag & drop `build` folder
   - AWS: Upload to S3 + CloudFront

## ✅ Checklist Before Shipping

- [ ] All features tested locally
- [ ] API endpoints verified
- [ ] Error messages user-friendly
- [ ] Loading states working
- [ ] Responsive design tested on mobile
- [ ] Authentication flow complete
- [ ] Protected routes working
- [ ] Admin features only for admins
- [ ] Build runs without errors
- [ ] Environment variables set
- [ ] Backend is production-ready

## 🎓 Next Steps

1. ✅ Get the app running
2. ✅ Test login/register
3. ✅ Explore existing features
4. ✅ Read FRONTEND_ARCHITECTURE.md
5. ✅ Add custom features as needed
6. ✅ Deploy to production

Enjoy building! 🎉
