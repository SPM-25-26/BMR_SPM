import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./components/WelcomePage', () => ({
  default: () => <div>WELCOME_PAGE</div>,
}));

vi.mock('./components/LoginPage', () => ({
  default: () => <div>LOGIN_PAGE</div>,
}));

vi.mock('./components/RegisterPage', () => ({
  default: () => <div>REGISTER_PAGE</div>,
}));

vi.mock('./components/ForgotPasswordPage', () => ({
  default: () => <div>FORGOT_PASSWORD_PAGE</div>,
}));

vi.mock('./components/ResetPasswordPage', () => ({
  default: () => <div>RESET_PASSWORD_PAGE</div>,
}));

vi.mock('./components/EmailVerification', () => ({
  default: () => <div>EMAIL_VERIFICATION_PAGE</div>,
}));

vi.mock('./components/EmailVerificationRequired', () => ({
  default: () => <div>EMAIL_VERIFICATION_REQUIRED_PAGE</div>,
}));

vi.mock('./components/OnboardingWizard', () => ({
  default: () => <div>ONBOARDING_PAGE</div>,
}));

vi.mock('./components/HomePage', () => ({
  default: () => <div>HOME_PAGE</div>,
}));

vi.mock('./components/DetailPage', () => ({
  default: () => <div>DETAIL_PAGE</div>,
}));

import App from './App';

const STORAGE_USER_KEY = 'authenticatedUser';
const STORAGE_USERPREFERENCES_KEY = 'userPreferences';

const confirmedUser = {
  name: 'Mario Rossi',
  userName: 'mrossi',
  email: 'mario@example.com',
  emailConfirmed: true,
};

const unconfirmedUser = {
  ...confirmedUser,
  emailConfirmed: false,
};

const preferencesWithInterests = {
  interests: ['Nature'],
  travelStyle: 'solo',
  dietaryNeeds: [],
};

const preferencesWithoutInterests = {
  interests: [],
  travelStyle: 'solo',
  dietaryNeeds: [],
};

describe('App routing guards', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('redirects anonymous user from "/" to welcome page', async () => {
    render(<App />);

    expect(await screen.findByText('WELCOME_PAGE')).toBeInTheDocument();
  });

  it('redirects unconfirmed user from "/" to needs-verification', async () => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(unconfirmedUser));

    render(<App />);

    expect(await screen.findByText('EMAIL_VERIFICATION_REQUIRED_PAGE')).toBeInTheDocument();
  });

  it('redirects confirmed user without interests from "/" to onboarding', async () => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(confirmedUser));
    localStorage.setItem(STORAGE_USERPREFERENCES_KEY, JSON.stringify(preferencesWithoutInterests));

    render(<App />);

    expect(await screen.findByText('ONBOARDING_PAGE')).toBeInTheDocument();
  });

  it('shows home for confirmed user with interests on "/"', async () => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(confirmedUser));
    localStorage.setItem(STORAGE_USERPREFERENCES_KEY, JSON.stringify(preferencesWithInterests));

    render(<App />);

    expect(await screen.findByText('HOME_PAGE')).toBeInTheDocument();
  });

  it('redirects authenticated user away from "/welcome" to "/"', async () => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(confirmedUser));
    localStorage.setItem(STORAGE_USERPREFERENCES_KEY, JSON.stringify(preferencesWithInterests));
    window.history.pushState({}, '', '/welcome');

    render(<App />);

    expect(await screen.findByText('HOME_PAGE')).toBeInTheDocument();
  });
});