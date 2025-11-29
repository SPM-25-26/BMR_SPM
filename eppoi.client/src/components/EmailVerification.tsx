import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, RefreshCw, XCircle } from "lucide-react";
import logoImage from "figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png";
import { confirmEmail, ApiErrorWithResponse } from '../api/authApi';
import { decodeJwt } from './ui/utils';

interface EmailVerificationProps {
  onLogin: (userData: { name: string; userName: string; email: string, emailConfirmed: boolean }) => void;
}

export default function EmailVerification({ onLogin }: EmailVerificationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Guard per impedire esecuzioni multiple dell'effetto (anche con StrictMode)
  const hasRunRef = useRef(false);

  const onContinue = () => {
    navigate("/");
  };

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const id = params.get("id");

    if (!token || !id) {
      navigate("/", { replace: true });
      return;
    }

    setIsVerifying(true);
    
    const verifyMail = async () => {
      try {
        const response = await confirmEmail(id!, token!);
        console.error('response'); console.log(response);
        
        if (response.success) {
          const jwtPayload = decodeJwt(response.result);

          if (jwtPayload) {
            localStorage.setItem('authToken', response.result);

            onLogin({
              name: jwtPayload.Name,
              userName: jwtPayload.UserName,
              email: '',
              emailConfirmed: true
            });

            setIsVerified(true);            
          } else {
            setIsVerified(false);
          }
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        console.error('confirm email err'); console.log(err);
        setIsVerified(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyMail();
  // Effetto deve girare una sola volta: niente dipendenze che causano riesecuzione
  }, []); 

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
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center">
            {isVerifying ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-blue-100 rounded-full p-4">
                    <Loader2 className="w-16 h-16 text-[#0066cc] animate-spin" />
                  </div>
                </div>
                <h1 className="text-[#004d99] text-[28px] sm:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-4">
                  Verifica mail in corso…
                </h1>
                <p className="text-[#004080] text-[16px] sm:text-[18px] font-['Titillium_Web:Regular',sans-serif] mb-8 leading-relaxed">
                  Attendi qualche istante mentre confermiamo il tuo indirizzo email.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                  <p className="text-blue-800 text-[14px] font-['Titillium_Web:SemiBold',sans-serif]">
                    ⏳ Stiamo verificando il tuo token di conferma
                  </p>
                </div>
              </>
            ) : (isVerified ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </div>
                <h1 className="text-[#004d99] text-[28px] sm:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-4">
                  Email Verificata!
                </h1>
                <p className="text-[#004080] text-[16px] sm:text-[18px] font-['Titillium_Web:Regular',sans-serif] mb-8 leading-relaxed">
                  Il tuo account è stato verificato con successo. Ora puoi accedere a tutte le funzionalità di Eppoi e iniziare a scoprire le migliori destinazioni turistiche.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                  <p className="text-green-800 text-[14px] font-['Titillium_Web:SemiBold',sans-serif]">
                    ✓ Account attivato correttamente
                  </p>
                </div>
                <button
                  onClick={onContinue}
                  className="w-full bg-[#0066cc] text-white py-4 rounded-lg font-['Titillium_Web:SemiBold',sans-serif] text-[18px] hover:bg-[#004d99] transition-all durata-200 shadow-lg hover:shadow-xl"
                >
                  Continua all'App
                </button>
              </>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-red-100 rounded-full p-4">
                    <XCircle className="w-16 h-16 text-red-600" />
                  </div>
                </div>
                <h1 className="text-[#004d99] text-[28px] sm:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-4">
                  Link Non Valido
                </h1>
                <p className="text-[#004080] text-[16px] sm:text-[18px] font-['Titillium_Web:Regular',sans-serif] mb-6 leading-relaxed">
                  Il link di verifica è scaduto o non è valido. Questo può accadere se:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <ul className="space-y-2 text-[#004080] text-[14px] sm:text-[15px] font-['Titillium_Web:Regular',sans-serif]">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Il link è già stato utilizzato</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Il link è scaduto (validità 24 ore)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Il token non è corretto</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-amber-700" />
                    <p className="text-amber-900 text-[14px] font-['Titillium_Web:SemiBold',sans-serif]">
                      Richiedi un nuovo link
                    </p>
                  </div>
                  <p className="text-amber-800 text-[13px] font-['Titillium_Web:Regular',sans-serif]">
                    Accedi all'app e richiedi un nuovo link di verifica dalla tua area personale
                  </p>
                </div>
                <button
                  onClick={onContinue}
                  className="w-full bg-[#0066cc] text-white py-4 rounded-lg font-['Titillium_Web:SemiBold',sans-serif] text-[18px] hover:bg-[#004d99] transition-all durata-200 shadow-lg hover:shadow-xl"
                >
                  Vai all'App
                </button>
              </>
            ))}
          </div>
          <p className="text-white text-center text-[14px] font-['Titillium_Web:Regular',sans-serif] mt-6 opacity-90">
            Benvenuto in Eppoi! 🎉
          </p>
        </div>
      </div>
      <div className="bg-[#004080] px-4 py-4 text-center">
        <p className="text-[#bfdfff] text-[12px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
          © 2025 Eppoi - Powered by Italian Design System
        </p>
      </div>
    </div>
  );
}
