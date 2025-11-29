import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { registerUser, ApiErrorWithResponse } from '../api/authApi';
import PasswordInput from './ui/PasswordInput';
import LoadingSpinner from './ui/LoadingSpinner';
import ValidationErrorsList from './ui/ValidationErrorsList';
import ErrorModal from './ui/ErrorModal';

interface RegisterPageProps {
  onRegister: (userData: { name: string; userName: string; email: string }) => void;
}

type ErrorType = 'duplicate-user' | 'server-error' | null;

interface ErrorState {
  type: ErrorType;
  title: string;
  message: string;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [errorState, setErrorState] = useState<ErrorState>({ type: null, title: '', message: '' });
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Validation functions
  const validateEmail = (emailValue: string): string[] => {
    const errors: string[] = [];
    const allowedCharsRegex = /^[a-zA-Z0-9\-._@+]*$/;

    if (emailValue.length > 0 && !allowedCharsRegex.test(emailValue)) {
      errors.push("L'email contiene caratteri non validi. Sono consentiti solo: a-z, A-Z, 0-9, -, ., _, @, +");
    }

    return errors;
  };

  const validatePassword = (passwordValue: string): string[] => {
    const errors: string[] = [];

    if (passwordValue.length > 0 && passwordValue.length < 6) {
      errors.push("La password deve contenere almeno 6 caratteri");
    }

    if (passwordValue.length > 0 && !/\d/.test(passwordValue)) {
      errors.push("La password deve contenere almeno un numero");
    }

    if (passwordValue.length > 0 && !/[A-Z]/.test(passwordValue)) {
      errors.push("La password deve contenere almeno una lettera maiuscola ('A'-'Z')");
    }

    if (passwordValue.length > 0 && !/[^a-zA-Z0-9]/.test(passwordValue)) {
      errors.push("La password deve contenere almeno un carattere speciale: !@#$%^&*()-_=+");
    }

    return errors;
  };

  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && acceptTerms && emailError.length === 0 && passwordError.length === 0;

  const setServerError = () => {
    setErrorState({
      type: 'server-error',
      title: 'Errore Server',
      message: 'Si è verificato un errore durante la registrazione. Il server non è attualmente disponibile. Riprova tra qualche minuto.'
    });
    setShowErrorModal(true);
  };

  const handleApiError = (errors: []) => {
    const emailErrors: string[] = [];
    const passwordErrors: string[] = [];
    let hasDuplicateError = false;    
    let hasServerError = false;

    errors.forEach(err => {
      if (err.code.toLowerCase().includes('duplicate')) {
        hasDuplicateError = true;
      }
      else if (err.code.toLowerCase().includes('invalid')) {
        emailErrors.push("L'email contiene caratteri non validi");
      } else if (err.code.toLowerCase().includes('password')) {
        switch (err.code) {
          case "PasswordRequiresNonAlphanumeric":
            passwordErrors.push("La password deve contenere almeno un carattere speciale: !@#$%^&*()-_=+");
            break;
          case "PasswordRequiresDigit":
            passwordErrors.push("La password deve contenere almeno un numero");
            break;
          case "PasswordRequiresUpper":
            passwordErrors.push("La password deve contenere almeno una lettera maiuscola ('A'-'Z')");
            break;
          case "PasswordTooShort":
            passwordErrors.push("La password deve contenere almeno 6 caratteri");
            break;
          default:
            passwordErrors.push("Password troppo debole");
            break;
        }
      }
      else {
        hasServerError = true;
      }
    });

    if (hasDuplicateError) {
      setErrorState({
        type: 'duplicate-user',
        title: 'Utente già registrato',
        message: 'Accedi con le tue credenziali o utilizza un\'altra email.'
      });
      setShowErrorModal(true);
    } else if (hasServerError) {
      setServerError();
    }

    setEmailError(emailErrors);
    setPasswordError(passwordErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      setIsLoading(true);
      try {
        const capitalizedName = name.trim().charAt(0).toUpperCase() + name.slice(1);

        const response = await registerUser({
          name: capitalizedName,
          userName: email,
          email: email,
          password: password
        });

        if (response.success) {          
          onRegister(response.result);
          // Naviga automaticamente a / dopo la registrazione riuscita
          navigate('/');
        } else {
          handleApiError(response.result.errors);
        }
      } catch (err) {
        if (err instanceof ApiErrorWithResponse && err.response) {
          const errors = err.response.result?.errors || [];
          handleApiError(errors);
        } else {          
          setServerError();
        }
      } finally {
        setIsLoading(false);
      }      
    }
  };

  const triggerSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const validationErrors = validateEmail(newEmail);
    setEmailError(validationErrors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const validationErrors = validatePassword(newPassword);
    setPasswordError(validationErrors);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorState({ type: null, title: '', message: '' });
  };

  const handleRetry = () => {
    closeErrorModal();
    if (errorState.type === 'duplicate-user') {
      navigate('/login');
    } else { 
      triggerSubmit();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#004d99] relative">
      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner message="Registrazione in corso..." />}

      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <button
            onClick={() => navigate('/welcome')}
            disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#0066cc] hover:bg-[#bfdfff] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">Indietro</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="w-full sm:max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-[#0066cc] p-3 sm:p-4 rounded-full">
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h2 className="text-[#004d99] text-[24px] sm:text-[28px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] text-center mb-2">
              Registrazione
            </h2>
            <p className="text-[#004080] text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] text-center mb-5 sm:mb-6 md:mb-8">
              Crea il tuo account per iniziare
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 md:space-y-5">
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-[#0066cc] focus:outline-none text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="inserisci il tuo nome"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-[#0066cc] focus:outline-none text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="inserisci la tua email"
                  required
                />
                <ValidationErrorsList errors={emailError} />
              </div>

              {/* Password Field */}
              <div>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="crea una password"
                />
                <ValidationErrorsList errors={passwordError} />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#0066cc] border-gray-300 rounded focus:ring-[#0066cc] mt-1 disabled:cursor-not-allowed"
                  required
                />
                <label 
                  htmlFor="terms" 
                  className="ml-2 text-[#004080] text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                >
                  Accetto i{' '}
                  <a href="#" className="text-[#0066cc] hover:underline">
                    termini e condizioni
                  </a>
                  {' '}e la{' '}
                  <a href="#" className="text-[#0066cc] hover:underline">
                    privacy policy
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                {isLoading ? 'Registrazione...' : 'Registrati'}
              </button>

              {/* Divider */}
              <div className="relative my-3.5 sm:my-4 md:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-500 text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    Hai già un account?
                  </span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => navigate('/login')}
                disabled={isLoading}
                className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#004080] px-3 sm:px-4 py-3 sm:py-4 text-center">
        <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
          © 2025 Eppoi - Powered by Italian Design System
        </p>
      </div>

      {/* Error Modal */}
      {errorState.type !== null && (
        <ErrorModal
          isOpen={showErrorModal}
          title={errorState.title}
          message={errorState.message}
          onClose={closeErrorModal}
          onRetry={handleRetry}
          retryLabel={errorState.type === 'duplicate-user' ? 'Accedi' : 'Riprova'}
          cancelLabel="Annulla"
          isWarning={errorState.type === 'duplicate-user'}
        />
      )}
    </div>
  );
}