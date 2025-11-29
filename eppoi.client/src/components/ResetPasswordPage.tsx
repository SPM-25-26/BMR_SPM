import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { resetPassword, ApiErrorWithResponse } from '../api/authApi';
import PasswordInput from './ui/PasswordInput';
import LoadingSpinner from './ui/LoadingSpinner';
import ValidationErrorsList from './ui/ValidationErrorsList';
import ErrorModal from './ui/ErrorModal';
import SuccessModal from './ui/SuccessModal';

interface ErrorState {
  title: string;
  message: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>([]);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userId = searchParams.get('id');
  const token = searchParams.get('token');

  // Validation functions
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

  const validateConfirmPassword = (confirmValue: string, passwordValue: string): string[] => {
    const errors: string[] = [];

    if (confirmValue.length > 0 && confirmValue !== passwordValue) {
      errors.push("Le password non corrispondono");
    }

    return errors;
  };

  const isFormValid = 
    password.trim() !== '' && 
    confirmPassword.trim() !== '' && 
    passwordError.length === 0 && 
    confirmPasswordError.length === 0 &&
    userId &&
    token;

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorState(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const handleRetry = () => {
    closeErrorModal();
    triggerSubmit();
  };

  const triggerSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const validationErrors = validatePassword(newPassword);
    setPasswordError(validationErrors);

    // Check confirm password match if confirm password has a value
    if (confirmPassword.length > 0) {
      const confirmErrors = validateConfirmPassword(confirmPassword, newPassword);
      setConfirmPasswordError(confirmErrors);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    const validationErrors = validateConfirmPassword(newConfirmPassword, password);
    setConfirmPasswordError(validationErrors);
  };

  useEffect(() => {
    if (!userId || !token) {
      setErrorState({
        title: 'Link non valido',
        message: 'Il link per il reset della password non è valido o è scaduto. Richiedi un nuovo link.'
      });
      setShowErrorModal(true);
    }
  }, [userId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      setIsLoading(true);
      
      try {
        const response = await resetPassword(userId!, token!, password);

        if (response.success) {
          setShowSuccessModal(true);
        } else {
          setErrorState({
            title: 'Errore nel reset della password',
            message: 'Controlla che il link sia valido e non sia scaduto. Riprova.'
          });
          setShowErrorModal(true);
        }
      } catch (err) {
        if (err instanceof ApiErrorWithResponse && err.response) {
          setErrorState({
            title: 'Errore nel reset della password',
            message: 'Controlla che il link sia valido e non sia scaduto. Riprova.'
          });
          setShowErrorModal(true);
        } else {
          setErrorState({
            title: 'Errore Server',
            message: 'Si è verificato un errore durante il reset della password. Il server non è attualmente disponibile. Riprova tra qualche minuto.'
          });
          setShowErrorModal(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#004d99] relative">
      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner message="Reset password in corso..." />}

      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <button
            onClick={() => navigate('/login')}
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
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h2 className="text-[#004d99] text-[24px] sm:text-[28px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] text-center mb-2">
              Reimposta Password
            </h2>
            <p className="text-[#004080] text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] text-center mb-5 sm:mb-6 md:mb-8">
              Inserisci la tua nuova password
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* New Password Field */}
              <div>
                <PasswordInput
                  id="password"
                  label="Nuova Password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="crea una nuova password"
                />
                <ValidationErrorsList errors={passwordError} />
              </div>

              {/* Confirm Password Field */}
              <div>
                <PasswordInput
                  id="confirmPassword"
                  label="Conferma Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={isLoading}
                  placeholder="conferma la tua password"
                />
                <ValidationErrorsList errors={confirmPasswordError} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                {isLoading ? 'Reset in corso...' : 'Reimposta Password'}
              </button>

              {/* Info Box */}
              <div className="bg-[#f0f7ff] border-l-4 border-[#0066cc] rounded p-4">
                <p className="text-[#004080] text-[13px] sm:text-[14px] md:text-[15px] font-['Titillium_Web:Regular',sans-serif] leading-relaxed">
                  La password deve contenere almeno 6 caratteri, un numero, una lettera maiuscola e un carattere speciale.
                </p>
              </div>
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
      {errorState && (
        <ErrorModal
          isOpen={showErrorModal}
          title={errorState.title}
          message={errorState.message}
          onClose={closeErrorModal}
          onRetry={handleRetry}
          retryLabel="Riprova"
          cancelLabel="Annulla"
          isWarning={errorState.title !== 'Password reimpostata'}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Password reimpostata"
        message="La tua password è stata reimpostata con successo. Accedi con la tua nuova password."
        onAction={closeSuccessModal}
        actionLabel="Accedi"
      />
    </div>
  );
}
