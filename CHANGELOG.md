# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Landing Page**
  - Hero section with call-to-action for new candidates
  - Feature cards highlighting onboarding portal capabilities
  - Responsive layout adapting to mobile, tablet, and desktop viewports

- **Candidate Interest Form**
  - Multi-field form for candidate submissions (name, email, phone, position, message)
  - Client-side validation with real-time error feedback
  - Success confirmation upon form submission
  - Form data persisted to localStorage for durability across sessions

- **Admin Login**
  - Dedicated login page with hardcoded credentials for initial access
  - Session-based authentication using sessionStorage
  - Protected admin routes redirecting unauthenticated users to login

- **Admin Dashboard**
  - View all candidate submissions in a structured table layout
  - Edit existing submissions with pre-populated form fields
  - Delete submissions with confirmation handling
  - Real-time updates reflecting changes to localStorage data

- **Navigation & Layout**
  - Persistent header with navigation links across all pages
  - Conditional navigation items based on authentication state
  - Logout functionality clearing session and redirecting to home

- **Data Persistence**
  - localStorage used for candidate submission data persistence
  - sessionStorage used for admin authentication state management

- **Deployment**
  - Vercel deployment configuration via vercel.json
  - SPA routing support with rewrite rules for client-side navigation
  - Production-ready Vite build configuration