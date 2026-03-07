import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png', () => ({
  default: 'logo-mock.png',
}));

vi.mock('../api/authApi', () => ({
  registerUser: vi.fn(),
  ApiErrorWithResponse: class ApiErrorWithResponse extends Error {
    response?: unknown;
  },
}));

vi.mock('./ui/LoadingSpinner', () => ({
  default: () => null,
}));

vi.mock('./ui/ErrorModal', () => ({
  default: () => null,
}));

import RegisterPage from './RegisterPage';

describe('RegisterPage - fields validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('show validation error for email/password and keep submit disabled', async () => {
    const user = userEvent.setup();

    render(<RegisterPage onRegister={vi.fn()} />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/Accetto i/i);
    const submitButton = screen.getByRole('button', { name: 'Registrati' });

    await user.type(nameInput, 'Mario');
    await user.type(emailInput, 'mario#example.com');
    await user.type(passwordInput, 'abc');
    await user.click(termsCheckbox);

    expect(
      screen.getByText("L'email contiene caratteri non validi. Sono consentiti solo: a-z, A-Z, 0-9, -, ., _, @, +")
    ).toBeInTheDocument();

    expect(screen.getByText('La password deve contenere almeno 6 caratteri')).toBeInTheDocument();
    expect(screen.getByText('La password deve contenere almeno un numero')).toBeInTheDocument();
    expect(screen.getByText("La password deve contenere almeno una lettera maiuscola ('A'-'Z')")).toBeInTheDocument();
    expect(screen.getByText('La password deve contenere almeno un carattere speciale: !@#$%^&*()-_=+')).toBeInTheDocument();

    expect(submitButton).toBeDisabled();

    await user.clear(emailInput);
    await user.type(emailInput, 'mario@example.com');

    await waitFor(() => {
      expect(
        screen.queryByText("L'email contiene caratteri non validi. Sono consentiti solo: a-z, A-Z, 0-9, -, ., _, @, +")
      ).not.toBeInTheDocument();
    });
  });
});