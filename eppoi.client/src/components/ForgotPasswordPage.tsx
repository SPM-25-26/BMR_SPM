import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Send, CheckCircle } from "lucide-react";
import logoImage from "figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png";
import { recoverPassword, ApiErrorWithResponse } from '../api/authApi';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';

interface ErrorState {
  title: string;
  message: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorState(null);
  };

  const handleRetry = () => {
    closeErrorModal();
    triggerSubmit();
  };

  const triggerSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setIsLoading(true);
      
      try {
        const response = await recoverPassword(email);

        if (response.success) {
          setIsSubmitted(true);
        } else {
          setErrorState({
            title: 'Errore nel recupero password',
            message: 'Si è verificato un errore durante il recupero della password. Riprova tra qualche minuto.'
          });
          setShowErrorModal(true);
        }
      } catch (err) {
        
        if (err instanceof ApiErrorWithResponse && err.response) {
          // Api returns success=false if mail doesn't exist, but we do not want to let user know if a mail is registered for security reasons
          setIsSubmitted(true);
        } else {
          console.error('>>>catchit fakeee'); console.log(err);
          setErrorState({
            title: 'Errore Server',
            message: 'Si è verificato un errore durante il recupero della password. Il server non è attualmente disponibile. Riprova tra qualche minuto.'
          });
          setShowErrorModal(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onNavigateToLogin = () => {
    navigate('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#004d99] relative">
      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner message="Recupero password in corso..." />}

      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img
            src={logoImage}
            alt="Eppoi"
            className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2"
          />
          <button
            onClick={onNavigateToLogin}
            disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#0066cc] hover:bg-[#bfdfff] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">
              Indietro
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="w-full sm:max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-[#0066cc] p-3 sm:p-4 rounded-full">
                <KeyRound className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h2 className="text-[#004d99] text-[24px] sm:text-[28px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] text-center mb-2">
              Password Dimenticata
            </h2>
            <p className="text-[#004080] text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] text-center mb-5 sm:mb-6 md:mb-8">
              Inserisci la tua email per ricevere le istruzioni di recupero
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
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
                  disabled={isLoading || isSubmitted}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-[#0066cc] focus:outline-none text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="inserisci la tua email"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSubmitted || !email.trim()}
                className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                <Send className="w-5 h-5" />
                {isLoading ? "Recupero in corso..." : isSubmitted ? "Reset inviato" : "Invia Email di Recupero"}
              </button>

              {/* Success Message */}
              {isSubmitted && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-700 text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif] mb-1">
                      Reset password effettuato con successo!
                    </p>
                    <p className="text-green-600 text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                      Se l'indirizzo è registrato, ti abbiamo inviato un link per reimpostare la password.
                      Controlla la tua casella di posta elettronica e segui le istruzioni per reimpostare la password.
                    </p>
                  </div>
                </div>
              )}              
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
        />
      )}
    </div>
  );
}
