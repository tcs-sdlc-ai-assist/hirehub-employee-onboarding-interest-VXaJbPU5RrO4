# Deployment Guide — HireHub Onboarding Portal

## Overview

This guide covers deploying the HireHub Onboarding Portal as a static site on **Vercel**. The application is built with React 18+ and Vite, producing a static `dist/` folder that can be served from any CDN-backed hosting platform.

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient)
- The project repository hosted on **GitHub**, **GitLab**, or **Bitbucket**
- Node.js 18+ and npm 9+ installed locally (for testing builds before deployment)

---

## Step 1: Connect Your GitHub Repository to Vercel

1. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select **"Import Git Repository"** and authorize Vercel to access your GitHub account if prompted.
3. Find and select the **hirehub-onboarding-portal** repository from the list.
4. Click **"Import"**.

Vercel will automatically detect the framework as **Vite** and pre-fill the build settings.

---

## Step 2: Verify Build Settings

Vercel auto-detects Vite projects, but confirm the following settings on the project configuration screen:

| Setting              | Value            |
|----------------------|------------------|
| **Framework Preset** | Vite             |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |
| **Node.js Version**  | 18.x (or later)  |

If any of these are incorrect, override them manually before clicking **"Deploy"**.

---

## Step 3: Configure SPA Routing

Since this is a single-page application using client-side routing, all routes must resolve to `index.html`. Create a `vercel.json` file in the project root if it does not already exist:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/dashboard`, `/onboarding/step-2`) serves the React app instead of returning a 404.

> **Note:** Commit and push `vercel.json` to your repository. Vercel reads this file automatically on every deployment.

---

## Step 4: Environment Variables

This application **does not require any environment variables** for deployment. All configuration is bundled at build time.

If you add environment variables in the future, follow these rules:

- All client-side environment variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Add them in the Vercel dashboard under **Settings → Environment Variables**.
- Select the appropriate environments: **Production**, **Preview**, and/or **Development**.
- Access them in code via `import.meta.env.VITE_API_URL` — never use `process.env`.
- After adding or changing environment variables, **redeploy** the project for changes to take effect.

---

## Step 5: Deploy

1. Click **"Deploy"** on the Vercel project configuration screen.
2. Vercel will run `npm install`, then `npm run build`, and deploy the contents of `dist/`.
3. Once complete, Vercel provides a live URL (e.g., `https://hirehub-onboarding-portal.vercel.app`).

All subsequent pushes to the **main** branch will trigger automatic production deployments. Pull requests will generate **preview deployments** with unique URLs.

---

## Step 6: Custom Domain Setup

1. Navigate to your project on the Vercel dashboard.
2. Go to **Settings → Domains**.
3. Click **"Add"** and enter your custom domain (e.g., `onboarding.yourdomain.com`).
4. Vercel will display DNS configuration instructions:
   - **For apex domains** (e.g., `yourdomain.com`): Add an **A record** pointing to `76.76.21.21`.
   - **For subdomains** (e.g., `onboarding.yourdomain.com`): Add a **CNAME record** pointing to `cname.vercel-dns.com`.
5. Wait for DNS propagation (typically 1–10 minutes, up to 48 hours in rare cases).
6. Vercel automatically provisions and renews **SSL/TLS certificates** via Let's Encrypt.

---

## Verifying Your Deployment

After deployment, verify the following:

- [ ] The root URL (`/`) loads the application correctly.
- [ ] Deep links (e.g., `/dashboard`) load without 404 errors (confirms SPA rewrites are working).
- [ ] Static assets (CSS, JS, images) load without errors (check the browser DevTools Network tab).
- [ ] The page is served over HTTPS with a valid certificate.

---

## Troubleshooting

### Build fails with "command not found: vite"

Ensure `vite` is listed in `devDependencies` in `package.json`, not as a global dependency. Vercel runs `npm install` which installs dev dependencies by default.

```bash
# Verify locally
npm ls vite
```

### 404 errors on page refresh or direct navigation

The `vercel.json` rewrites are missing or misconfigured. Ensure the file exists in the project root and contains the rewrite rule described in Step 3. Redeploy after adding it.

### Blank page after deployment

1. Open the browser DevTools console and check for errors.
2. Verify the `base` option in `vite.config.js` is set to `'/'` (or not set at all, which defaults to `'/'`).
3. Ensure the `dist/` directory contains an `index.html` file by running `npm run build` locally and inspecting the output.

### Assets return 404 (JS/CSS files not found)

This usually means the `output directory` in Vercel is misconfigured. Confirm it is set to `dist` (not `build`, `out`, or `public`).

### Environment variables are undefined at runtime

- Confirm the variable name starts with `VITE_`.
- Confirm the variable is added in the Vercel dashboard for the correct environment (Production vs. Preview).
- Redeploy after adding or changing variables — Vite inlines environment variables at build time.

### Deployment is slow or hangs

- Check if `package-lock.json` is committed to the repository. Vercel uses it for faster, deterministic installs.
- Avoid running unnecessary scripts in the `postinstall` hook.

### Preview deployments not generating for pull requests

- Ensure the GitHub integration is properly connected under **Settings → Git** in the Vercel dashboard.
- Verify the repository is not set to only deploy the production branch.

---

## Local Build Verification

Before pushing to trigger a deployment, you can verify the production build locally:

```bash
# Install dependencies
npm install

# Run the production build
npm run build

# Preview the production build locally
npm run preview
```

The `npm run preview` command starts a local server serving the `dist/` folder, simulating the production environment.

---

## Continuous Deployment Workflow

| Trigger                        | Deployment Type | URL                                          |
|--------------------------------|-----------------|----------------------------------------------|
| Push to `main` branch         | Production      | `https://your-project.vercel.app`            |
| Pull request opened/updated   | Preview         | `https://your-project-<hash>.vercel.app`     |
| Manual deploy via Vercel CLI   | Production      | `https://your-project.vercel.app`            |

To deploy manually using the Vercel CLI:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel --prod
```

---

## Project Structure Reference

```
hirehub-onboarding-portal/
├── public/              # Static assets copied as-is to dist/
├── src/
│   ├── main.jsx         # Application entry point
│   ├── App.jsx          # Root component with routing
│   └── ...
├── dist/                # Build output (git-ignored)
├── vercel.json          # Vercel routing configuration
├── vite.config.js       # Vite build configuration
├── package.json         # Dependencies and scripts
└── index.html           # HTML entry point
```