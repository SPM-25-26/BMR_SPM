import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin, type NonOAuthError } from '@react-oauth/google';
import LoginSocialFacebook from '@greatsumini/react-facebook-login';
import { Loader2 } from 'lucide-react';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { convertPreferencesFromStringListToStructure } from '../api/apiUtils';
import { loginGoogle } from '../api/authApi';
import ErrorModal from './ui/ErrorModal';
import { decodeJwt } from './ui/utils';

interface WelcomePageProps {
  onLogin: (
    userData: { name: string; userName: string; email: string, emailConfirmed: boolean },
    userPreferences: unknown
  ) => void;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  access_token: string;
}

interface FacebookUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  data_access_expiration_time: number;
  expiresIn: number;
}

interface ErrorState {
  title: string;
  message: string;
}

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export default function WelcomePage({ onLogin }: WelcomePageProps) {
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorState(null);
  };

  const getNonAuthErrorMessage = (nonOAuthError: NonOAuthError): ErrorState => {
    const errorType = nonOAuthError.type || 'unknown';
    
    const errorMessages: { [key: string]: ErrorState } = {
      popup_failed_to_open: {
        title: 'Errore di Apertura',
        message: 'Impossibile aprire la finestra di accesso a Google. Verifica che i popup non siano bloccati nel browser.'
      },
      popup_closed: {
        title: 'Accesso Annullato',
        message: 'La finestra di accesso a Google è stata chiusa. Se desideri accedere, riprova cliccando su "Continua con Google".'
      },
      unknown: {
        title: 'Errore di Accesso',
        message: 'Si è verificato un errore durante l\'accesso con Google. Riprova tra qualche minuto.'
      }
    };

    return errorMessages[errorType] || errorMessages['unknown'];
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Get user data by Google APIs
        const response = await axios.get<GoogleUserInfo>(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = response.data;
        userInfo.access_token = tokenResponse.access_token;
        console.log('User info:', userInfo);

        // Login on Eppoi system with Google data
        const apiResponse = await loginGoogle(userInfo.id, userInfo.name, userInfo.email, userInfo.email, userInfo.access_token);

        let googleLoginSuccess = false;
        if (apiResponse.success) {
          const jwtPayload = decodeJwt(apiResponse.result.token);

          if (jwtPayload) {
            localStorage.setItem('authToken', apiResponse.result.token);

            const preferencesInFlag = apiResponse.result.preferences;
            const preferencesStruct = convertPreferencesFromStringListToStructure(preferencesInFlag);

            googleLoginSuccess = true;
            
            onLogin({
              name: jwtPayload.Name,
              userName: jwtPayload.UserName,
              email: userInfo.email,
              emailConfirmed: true
            }, preferencesStruct);

            navigate('/');
          }
        } 

        if (!googleLoginSuccess) {
          const errorObj = getNonAuthErrorMessage({ type: 'unknown' });
          setErrorState(errorObj);
          setShowErrorModal(true);
        }
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Errore nella richiesta axios:', error.message);
          console.error('Status:', error.response?.status);
          console.error('Dati errore:', error.response?.data);
        } else {
          console.error('Errore sconosciuto:', error);
        }
        const errorObj = getNonAuthErrorMessage({ type: 'unknown' });
        setErrorState(errorObj);
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('>>google NOT LOGGED IN');
      console.log(errorResponse);
      const errorObj = getNonAuthErrorMessage({ type: 'unknown' });
      setErrorState(errorObj);
      setShowErrorModal(true);
    },
    onNonOAuthError: (nonOAuthError: NonOAuthError) => {
      const error = getNonAuthErrorMessage(nonOAuthError);
      setErrorState(error);
      setShowErrorModal(true);
    }
  });

  const handleFacebookAuthSuccess = async (response: FacebookAuthResponse) => {    
    // This is just the response with the auth token, the real step is on profile success
    // TODO - IF BACKEND NEEDS ACCESS TOKEN, THIS IS THE PLACE TO GET IT
    console.log('Facebook login response (token):', response);    
  };

  const handleFacebookProfileSuccess = async (response: FacebookUserInfo) => {
    console.log('Facebook login response (profile info):', response);
    setIsLoading(true);

    try {     
      
      // TODO: Implement backend api call
      
      
      // To remove when integrated
      setErrorState({
        title: 'Login Facebook',
        message: 'Integrazione Facebook completata! Ora devi implementare la chiamata API lato server.'
      });
      setShowErrorModal(true);      

    } catch (error) {
      console.error('Errore nel login Facebook:', error);
      setErrorState({
        title: 'Errore di Accesso',
        message: 'Si è verificato un errore durante l\'accesso con Facebook. Riprova tra qualche minuto.'
      });
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFacebookError = (error: any) => {
    console.error('Facebook login error:', error);
    if (error?.status == 'loginCancelled') {
      // No real error, just cancelled
      return;
    }
    setErrorState({
      title: 'Errore Facebook',
      message: 'La finestra di accesso a Facebook è stata chiusa o si è verificato un errore. Riprova.'
    });
    setShowErrorModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#004d99]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-[#0066cc]" />
            <p className="text-[#004d99] text-[18px] font-['Titillium_Web:SemiBold',sans-serif]">
              Accesso in corso...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <div className="text-[#bfdfff] text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
            Il tuo assistente turistico
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
        <div className="w-full sm:max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
            <h2 className="text-[#004d99] text-[24px] sm:text-[28px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] text-center mb-2">
              Benvenuto!
            </h2>
            <p className="text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:Regular',sans-serif] text-center mb-5 sm:mb-6 md:mb-8">
              Registrati e scopri le migliori esperienze turistiche
            </p>
            
            {/* Register Button */}
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-[#0066cc] hover:bg-[#004d99] text-white py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors mb-4 sm:mb-5 md:mb-6"
            >
              CREA UN ACCOUNT
            </button>

            {/* Divider */}
            <div className="relative my-4 sm:my-5 md:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-500 text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                  oppure
                </span>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-3 sm:py-3.5 md:py-4 px-6 rounded-lg text-[17px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors mb-4 sm:mb-5 md:mb-6"
            >
              LOGIN
            </button>

            {/* Divider */}
            <div className="relative my-4 sm:my-5 md:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-500 text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                  oppure accedi con
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2.5 sm:space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-2.5 sm:py-3 px-4 rounded-lg text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="truncate">Continua con Google</span>
              </button>
              
              {/* Facebook Login Button with Custom Render */}
              <LoginSocialFacebook
                appId={FACEBOOK_APP_ID}
                onSuccess={handleFacebookAuthSuccess}
                onFail={handleFacebookError}
                onProfileSuccess={handleFacebookProfileSuccess}
                fields="id,name,email,picture"
                scope="public_profile,email"
                render={({ onClick }) => (
                  <button
                    disabled={isLoading}
                    onClick={onClick}
                    className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-2.5 sm:py-3 px-4 rounded-lg text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                      <path fill="#4267B2" d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h10.306v-8.142h-2.555v-2.724h2.555v-2.021c0-2.481 1.588-3.677 3.168-3.677 1.017 0 1.858.087 2.316.136v2.461h-1.667c-1.237 0-1.422.574-1.422 1.402v1.983h2.888l-.419 2.898h-2.469v7.083h4.495c.248 0 .447-.08.615-.25l2.688-2.688C23.582 18.596 24 17.114 24 15.387V1.325C24.001.593 23.407 0 22.675 0z" />
                    </svg>
                    <span className="truncate">Continua con Facebook</span>
                  </button>
                )}
              >
              </LoginSocialFacebook>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {errorState && (
        <ErrorModal
          isOpen={showErrorModal}
          title={errorState.title}
          message={errorState.message}
          onClose={closeErrorModal}
          onRetry={() => {
            closeErrorModal();
            handleGoogleLogin();
          }}
          retryLabel="Riprova"
          cancelLabel="Chiudi"
        />
      )}

      {/* Footer */}
      <div className="bg-[#004080] px-3 sm:px-4 py-3 sm:py-4 text-center">
        <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
          © 2025 Eppoi - Powered by Italian Design System
        </p>
      </div>
    </div>
  );    
}