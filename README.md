# HireHub Onboarding Portal

A modern employee onboarding portal built with React 18+, Vite, and React Router v6. HireHub streamlines the new hire onboarding process with an intuitive interface for both administrators and new employees.

## Features

- **Admin Dashboard** — Manage onboarding tasks, track employee progress, and oversee the entire onboarding pipeline
- **Employee Onboarding Flow** — Step-by-step guided onboarding experience for new hires
- **Task Management** — Create, assign, and track onboarding tasks with status updates
- **Document Collection** — Collect and manage required employee documents
- **Progress Tracking** — Visual progress indicators for each employee's onboarding journey
- **Role-Based Access** — Separate views and permissions for admins and employees
- **Persistent Storage** — All data persisted via localStorage/sessionStorage for seamless experience
- **Responsive Design** — Fully responsive UI built with plain CSS (no CSS frameworks)

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18+** | UI library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Plain CSS** | Styling (no Tailwind, Bootstrap, etc.) |
| **localStorage / sessionStorage** | Client-side data persistence |
| **PropTypes** | Runtime prop type validation |

## Folder Structure

```
hirehub-onboarding-portal/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                  # Static assets (images, icons)
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components (Button, Input, Modal, etc.)
│   │   ├── layout/              # Layout components (Header, Sidebar, Footer)
│   │   ├── admin/               # Admin-specific components
│   │   └── employee/            # Employee-specific components
│   ├── context/                 # React context providers (Auth, Onboarding)
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page/route components
│   │   ├── admin/               # Admin pages (Dashboard, TaskManager, etc.)
│   │   ├── employee/            # Employee pages (Onboarding, Profile, etc.)
│   │   └── auth/                # Authentication pages (Login, Register)
│   ├── services/                # Data services (storage utilities, API mocks)
│   ├── utils/                   # Utility functions and helpers
│   ├── styles/                  # Global CSS and CSS variables
│   ├── App.jsx                  # Root component with router configuration
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 16+ (recommended: 18+)
- **npm** 8+ (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hirehub-onboarding-portal

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Admin Credentials

For accessing the admin dashboard, use the following default credentials:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin` |

> ⚠️ These are default development credentials. Change them before any production deployment.

## Storage Schema

All application data is persisted in the browser using `localStorage` and `sessionStorage`.

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `hirehub_users` | `Array<User>` | Registered user accounts |
| `hirehub_tasks` | `Array<Task>` | Onboarding task definitions |
| `hirehub_employee_tasks` | `Array<EmployeeTask>` | Task assignments per employee |
| `hirehub_documents` | `Array<Document>` | Uploaded document metadata |
| `hirehub_onboarding_progress` | `Object<string, Progress>` | Employee onboarding progress keyed by user ID |
| `hirehub_settings` | `Object` | Application settings and configuration |

### sessionStorage Keys

| Key | Type | Description |
|---|---|---|
| `hirehub_current_user` | `User` | Currently authenticated user session |
| `hirehub_auth_token` | `string` | Session authentication token |

### Data Models

**User**
```json
{
  "id": "string",
  "username": "string",
  "password": "string (hashed)",
  "role": "admin | employee",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "department": "string",
  "startDate": "string (ISO 8601)",
  "createdAt": "string (ISO 8601)"
}
```

**Task**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "low | medium | high",
  "dueInDays": "number",
  "isRequired": "boolean",
  "createdAt": "string (ISO 8601)"
}
```

**EmployeeTask**
```json
{
  "id": "string",
  "userId": "string",
  "taskId": "string",
  "status": "pending | in_progress | completed",
  "completedAt": "string | null",
  "notes": "string"
}
```

**Document**
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "type": "string",
  "status": "pending | approved | rejected",
  "uploadedAt": "string (ISO 8601)"
}
```

**Progress**
```json
{
  "userId": "string",
  "totalTasks": "number",
  "completedTasks": "number",
  "percentage": "number",
  "currentStep": "string",
  "lastUpdated": "string (ISO 8601)"
}
```

## Environment Variables

Environment variables are accessed via `import.meta.env` (Vite convention). Create a `.env` file in the project root:

```env
VITE_APP_TITLE=HireHub Onboarding Portal
VITE_STORAGE_PREFIX=hirehub
```

> All custom environment variables must be prefixed with `VITE_` to be exposed to the client.

## Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

### Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in the [Vercel Dashboard](https://vercel.com/new)
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add any required environment variables in the Vercel project settings
5. Deploy

### SPA Routing Configuration

Since this is a single-page application using client-side routing, add a `vercel.json` file to the project root to handle route rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that all routes are handled by the React Router instead of returning 404 errors.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.