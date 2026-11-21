# Super Shop Management System — Admin Module

## Folder structure

```text
super-shop-management/
├── index.html
├── register.html
├── forgot-password.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── common.js
│   ├── login.js
│   ├── register.js
│   ├── forgot-password.js
│   ├── admin.js
│   ├── role-access.js
│   ├── audit-security.js
│   └── backup-reports.js
└── admin/
    ├── admin.html
    ├── role-access.html
    ├── audit-security.html
    └── backup-reports.html
```

## Run the project

1. Extract `super-shop-management-admin.zip`.
2. Open the extracted folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Sign in with the demo Admin account below.

## Demo Admin login

- Email: `admin@supershop.com`
- Password: `Admin@123`
- Login as: `Admin`

## What works in this front-end demo

- Login field validation and Admin routing.
- Registration validation; newly registered accounts have Pending status.
- Forgot-password email format check (no email is sent and no password is reset).
- Admin dashboard statistics.
- User create, search, edit, delete and approve actions.
- Login history and activity log filters.
- Demo security preference checkboxes.
- Download JSON backup (passwords and user accounts are excluded).
- Restore selected demo records from a matching JSON backup.
- Generate and download CSV reports.
- Browser `localStorage` keeps demo records available between the pages.

## Important security note

This is a browser-only learning project. Demo passwords are stored in browser localStorage, and client-side role checks can be bypassed. Do not use real customer data or real passwords. A production system needs server-side authentication, password hashing, database-backed permissions, server-side audit logs and secure backups. Payment processing is not included.
# fall-26-27-super-shop-management-system
