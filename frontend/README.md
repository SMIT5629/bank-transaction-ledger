# Bank Transaction Ledger Frontend

A production-grade React frontend for the Bank Transaction Ledger application with feature-based architecture.

## Project Structure

```
src/
├── features/              # Feature modules
│   ├── auth/             # Authentication (Login, Register)
│   ├── dashboard/        # User dashboard and layout
│   ├── accounts/         # Account management
│   ├── transactions/     # Transaction management
│   ├── admin/            # Admin dashboard
│   └── profile/          # User profile management
├── shared/               # Shared utilities
│   ├── services/         # API service
│   ├── context/          # Auth context
│   ├── hooks/            # Custom hooks (useAuth)
│   └── components/       # Shared components (ProtectedRoute)
├── styles/               # Global styles
├── App.js                # Main app component with routing
└── index.js              # App entry point
```

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Auto-logout on unauthorized access

### User Dashboard
- Account summary and statistics
- Recent transactions view
- Quick access to all features

### Accounts Management
- View all accounts
- Create new accounts
- Delete accounts
- Account type management

### Transactions
- Create transactions (transfer, deposit, withdrawal, payment)
- Filter by type and status
- View transaction history
- Transaction details

### Admin Dashboard
- System statistics
- User management
- Account management
- Transaction management
- Role-based access control

### User Profile
- Edit profile information
- Change password
- View account settings

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Environment Setup

Make sure the backend is running at `http://localhost:5000`

The API service is configured in `src/shared/services/api.js`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account details
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `GET /api/accounts/:id/balance` - Get account balance

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-transactions` - Get recent transactions
- `GET /api/dashboard/account-summary` - Get account summary

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/accounts` - Get all accounts
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/stats` - Get system statistics

## Styling

The app uses vanilla CSS with CSS custom properties (variables) for theming. All styles are organized as follows:

- `src/styles/global.css` - Global styles and design system
- `src/features/*/styles/*.css` - Feature-specific styles

## Build

```bash
npm run build
```

## Testing

```bash
npm test
```

## License

Proprietary
