import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { loginUser } from '../api/authApi';
import { useEffect, useState } from 'react';
//import HomePage from './components/HomePage';


interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

interface Forecast {
    testresult: string;
}

export default function WelcomePage({ onNavigateToLogin, onNavigateToRegister }: WelcomePageProps) {
    const [forecast, setForecast] = useState<Forecast>();
    
    useEffect(() => {
        loginUser('test@test.it', 'testtest')
            .then(setForecast)
            .catch(console.error);
    }, []);

    const contents = forecast === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <p>backend message: {forecast.testresult}</p>;

  const handleGoogleLogin = () => {
    // Mock Google login
    alert('Google login would be implemented here');
  };

  const handleFacebookLogin = () => {
    // Mock Facebook login
    alert('Facebook login would be implemented here');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#004d99]">
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
                      {contents}
            {/* Register Button */}
            <button
              onClick={onNavigateToRegister}
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
              onClick={onNavigateToLogin}
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
                className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-2.5 sm:py-3 px-4 rounded-lg text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="truncate">Continua con Google</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full bg-white border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#f0f7ff] py-2.5 sm:py-3 px-4 rounded-lg text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="truncate">Continua con Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#004080] px-3 sm:px-4 py-3 sm:py-4 text-center">
        <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
          © 2025 Eppoi - Powered by Italian Design System
        </p>
      </div>
    </div>
    );    
}