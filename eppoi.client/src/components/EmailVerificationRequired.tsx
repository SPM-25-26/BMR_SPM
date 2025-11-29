import { useState } from 'react';
import { LogOut, Mail, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import logoImage from "figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png";

interface User {
  name: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
}

interface EmailVerificationRequiredProps {
  user: User | null;
  onLogout: () => void;
}

export default function EmailVerificationRequired({ onLogout, user }: EmailVerificationRequiredProps) {
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendEmail = () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setEmailSent(true);
      // Reset success message after 5 seconds
      setTimeout(() => setEmailSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0066cc] to-[#004d99] flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0066cc]">
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Eppoi Logo"
            className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2"
          />
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-['Titillium_Web:SemiBold',sans-serif] text-[14px] sm:text-[15px]">
            Esci
          </span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">

            {/* Mail Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-[#fff8e6] rounded-full p-5">
                <Mail className="w-16 h-16 text-[#ffd700]" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[#004d99] text-[28px] sm:text-[32px] font-['Titillium_Web:Bold',sans-serif] text-center mb-4">
              Verifica la tua email
            </h1>

            {/* Subtitle */}
            <p className="text-[#004080] text-[16px] sm:text-[18px] font-['Titillium_Web:Regular',sans-serif] text-center mb-8">
              Per accedere a tutte le funzionalità di Eppoi, devi prima verificare il tuo indirizzo email.
            </p>

            {/* Email Display */}
            <div className="bg-[#f0f7ff] border border-[#bfdfff] rounded-lg p-4 mb-8">
              <p className="text-[#004080] text-[14px] sm:text-[15px] font-['Titillium_Web:Regular',sans-serif] text-center mb-2">
                Abbiamo inviato un'email di verifica a:
              </p>
              <p className="text-[#0066cc] text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] text-center">
                {user?.email}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-8">
              {/* Instruction 1 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-['Titillium_Web:Bold',sans-serif]">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-[#004080] text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
                    Controlla la tua casella di posta elettronica
                  </p>
                </div>
              </div>

              {/* Instruction 2 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-['Titillium_Web:Bold',sans-serif]">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-[#004080] text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
                    Cerca l'email da <span className="font-['Titillium_Web:SemiBold',sans-serif]">Eppoi</span> con oggetto "Verifica il tuo indirizzo email"
                  </p>
                </div>
              </div>

              {/* Instruction 3 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-['Titillium_Web:Bold',sans-serif]">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-[#004080] text-[15px] sm:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
                    Clicca sul pulsante <span className="font-['Titillium_Web:SemiBold',sans-serif]">"Verifica Email"</span> nell'email
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Box - Spam */}
            <div className="bg-[#fff8e6] border-l-4 border-[#ffd700] rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff9900] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#004d99] text-[15px] font-['Titillium_Web:SemiBold',sans-serif] mb-1">
                    Non trovi l'email?
                  </p>
                  <p className="text-[#004080] text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    Controlla la cartella <span className="font-['Titillium_Web:SemiBold',sans-serif]">Spam</span> o <span className="font-['Titillium_Web:SemiBold',sans-serif]">Posta indesiderata</span>. A volte le email di verifica finiscono lì per errore.
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {emailSent && (
              <div className="bg-[#e6f9f0] border border-[#28a745] rounded-lg p-4 mb-6 animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#28a745] flex-shrink-0" />
                  <p className="text-[#28a745] text-[14px] sm:text-[15px] font-['Titillium_Web:SemiBold',sans-serif]">
                    Email inviata con successo! Controlla la tua casella di posta.
                  </p>
                </div>
              </div>
            )}

            {/* Info Text */}
            <p className="text-gray-600 text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif] text-center">
              Il link di verifica scadrà tra 48 ore
            </p>

          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#004080] px-4 py-4 text-center">
        <p className="text-[#bfdfff] text-[12px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
          © 2025 Eppoi - Powered by Italian Design System
        </p>
      </div>

    </div>
  );
}
