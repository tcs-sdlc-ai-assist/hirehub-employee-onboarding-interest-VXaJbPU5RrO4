import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import InterestForm from './components/InterestForm.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('Header rendering', () => {
    it('renders the header with HireHub logo on the landing page', () => {
      render(<App />);
      expect(screen.getByText('HireHub')).toBeDefined();
    });

    it('renders navigation links in the header', () => {
      render(<App />);
      expect(screen.getByText('Home')).toBeDefined();
      expect(screen.getByText('Apply')).toBeDefined();
      expect(screen.getByText('Admin')).toBeDefined();
    });

    it('renders the header on the apply route', () => {
      render(
        <MemoryRouter initialEntries={['/apply']}>
          <Header />
          <Routes>
            <Route path="/apply" element={<InterestForm />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('HireHub')).toBeDefined();
      expect(screen.getByText('Home')).toBeDefined();
      expect(screen.getByText('Apply')).toBeDefined();
      expect(screen.getByText('Admin')).toBeDefined();
    });

    it('renders the header on the admin route', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Header />
          <Routes>
            <Route path="/admin" element={<AdminLogin onLoginSuccess={() => {}} />} />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('HireHub')).toBeDefined();
      expect(screen.getByText('Home')).toBeDefined();
    });

    it('shows Login button when not authenticated', () => {
      render(<App />);
      expect(screen.getByText('Login')).toBeDefined();
    });

    it('shows Logout button when authenticated', () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      render(<App />);
      expect(screen.getByText('Logout')).toBeDefined();
    });
  });

  describe('Landing page', () => {
    it('renders the hero section with welcome heading', () => {
      render(<App />);
      expect(screen.getByText('Welcome to HireHub')).toBeDefined();
    });

    it('renders the hero subtitle text', () => {
      render(<App />);
      expect(
        screen.getByText(/Discover exciting opportunities and take the first step/)
      ).toBeDefined();
    });

    it('renders the Express Your Interest CTA button', () => {
      render(<App />);
      const ctaLinks = screen.getAllByText('Express Your Interest');
      expect(ctaLinks.length).toBeGreaterThan(0);
    });

    it('renders the Why Join Us section title', () => {
      render(<App />);
      expect(screen.getByText('Why Join Us?')).toBeDefined();
    });

    it('renders all four feature cards', () => {
      render(<App />);
      expect(screen.getByText('Innovation')).toBeDefined();
      expect(screen.getByText('Growth')).toBeDefined();
      expect(screen.getByText('Culture')).toBeDefined();
      expect(screen.getByText('Impact')).toBeDefined();
    });

    it('renders feature card descriptions', () => {
      render(<App />);
      expect(
        screen.getByText(/Work on cutting-edge projects/)
      ).toBeDefined();
      expect(
        screen.getByText(/Accelerate your career/)
      ).toBeDefined();
      expect(
        screen.getByText(/Join a diverse, inclusive team/)
      ).toBeDefined();
      expect(
        screen.getByText(/Make a meaningful difference/)
      ).toBeDefined();
    });

    it('renders the bottom CTA section', () => {
      render(<App />);
      expect(screen.getByText('Ready to Get Started?')).toBeDefined();
      expect(screen.getByText('Apply Now')).toBeDefined();
    });
  });

  describe('Navigation between pages', () => {
    it('navigates to the interest form when clicking Apply link', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      expect(screen.getByText('Express Your Interest')).toBeDefined();
      expect(screen.getByLabelText(/Full Name/)).toBeDefined();
    });

    it('navigates to admin login when clicking Admin link while not authenticated', async () => {
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      expect(screen.getByText('Admin Login')).toBeDefined();
      expect(screen.getByText('Sign in to access the admin dashboard')).toBeDefined();
    });

    it('navigates back to home when clicking Home link', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      expect(screen.getByLabelText(/Full Name/)).toBeDefined();

      const homeLink = screen.getByRole('link', { name: 'Home' });
      await user.click(homeLink);

      expect(screen.getByText('Welcome to HireHub')).toBeDefined();
    });

    it('navigates back to home when clicking HireHub logo', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      const logo = screen.getByText('HireHub');
      await user.click(logo);

      expect(screen.getByText('Welcome to HireHub')).toBeDefined();
    });
  });

  describe('Interest form route', () => {
    it('renders the interest form page title', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      const headings = screen.getAllByText('Express Your Interest');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('renders all form fields', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      expect(screen.getByLabelText(/Full Name/)).toBeDefined();
      expect(screen.getByLabelText(/Email Address/)).toBeDefined();
      expect(screen.getByLabelText(/Mobile Number/)).toBeDefined();
      expect(screen.getByLabelText(/Department/)).toBeDefined();
    });

    it('renders the submit button', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined();
    });

    it('renders the Back to Home link', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      expect(screen.getByText('← Back to Home')).toBeDefined();
    });

    it('renders department select with all options', async () => {
      const user = userEvent.setup();
      render(<App />);

      const applyLink = screen.getByRole('link', { name: 'Apply' });
      await user.click(applyLink);

      const departmentSelect = screen.getByLabelText(/Department/);
      expect(departmentSelect).toBeDefined();

      const options = departmentSelect.querySelectorAll('option');
      expect(options.length).toBe(8);
      expect(options[0].textContent).toBe('Select a department');
    });
  });

  describe('Admin route', () => {
    it('shows admin login form when not authenticated', async () => {
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      expect(screen.getByText('Admin Login')).toBeDefined();
      expect(screen.getByLabelText(/Username/)).toBeDefined();
      expect(screen.getByLabelText(/Password/)).toBeDefined();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined();
    });

    it('shows admin dashboard when authenticated', async () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      expect(screen.getByText('Admin Dashboard')).toBeDefined();
      expect(screen.getByText('Total Submissions')).toBeDefined();
    });

    it('shows error message for invalid credentials', async () => {
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      const usernameInput = screen.getByLabelText(/Username/);
      const passwordInput = screen.getByLabelText(/Password/);
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'wrong');
      await user.type(passwordInput, 'wrong');
      await user.click(signInButton);

      expect(screen.getByText('Invalid credentials. Please try again.')).toBeDefined();
    });

    it('transitions to dashboard after successful login', async () => {
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      const usernameInput = screen.getByLabelText(/Username/);
      const passwordInput = screen.getByLabelText(/Password/);
      const signInButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');
      await user.click(signInButton);

      expect(screen.getByText('Admin Dashboard')).toBeDefined();
      expect(screen.getByText('Total Submissions')).toBeDefined();
    });

    it('shows empty submissions message when no data exists', async () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      expect(screen.getByText('No submissions yet.')).toBeDefined();
    });

    it('shows validation error when submitting empty login form', async () => {
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      const signInButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(signInButton);

      expect(screen.getByText('Please enter both username and password.')).toBeDefined();
    });
  });

  describe('Logout functionality', () => {
    it('logs out and shows login form when Logout button is clicked', async () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      const user = userEvent.setup();
      render(<App />);

      const adminLink = screen.getByRole('link', { name: 'Admin' });
      await user.click(adminLink);

      expect(screen.getByText('Admin Dashboard')).toBeDefined();

      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await user.click(logoutButton);

      expect(screen.getByText('Welcome to HireHub')).toBeDefined();
    });
  });
});