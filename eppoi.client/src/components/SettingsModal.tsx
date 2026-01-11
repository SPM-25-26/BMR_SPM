import { useEffect } from 'react';
import { X, User, Mail, Landmark, Newspaper, Hotel, Calendar, MapPin, Utensils, ShoppingBag, Sparkles, Users, UsersRound, WheatOff, Milk, Leaf, Edit } from 'lucide-react';
import { type Category } from '../api/infoApi';
import { CATEGORY_INTERESTS } from '../api/apiUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userPreferences: {
    interests: string[];
    travelStyle: string;
    dietaryNeeds: string[];
  };
  categories: Array<Category> | null;
  onEditPreferences: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  userPreferences,
  categories,
  onEditPreferences,
}: SettingsModalProps) {
  // Blocca lo scroll del body quando il modal è aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup: ripristina lo scroll quando il componente viene smontato
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const travelStylesMap: { [key: string]: { name: string; icon: any } } = {
    'solo': { name: 'Viaggiatore solitario', icon: User },
    'coppia': { name: 'Coppia', icon: Users },
    'famiglia': { name: 'Famiglia', icon: UsersRound },
    'amici': { name: 'Gruppo di amici', icon: Users },
  };

  const dietaryOptionsMap: { [key: string]: { name: string; icon: any } } = {
    'celiachia': { name: 'Celiachia', icon: WheatOff },
    'lattosio': { name: 'Senza lattosio', icon: Milk },
    'vegetariano': { name: 'Vegetariano', icon: Leaf },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="bg-[#0066cc] px-5 sm:px-6 py-5 sm:py-6 flex items-center justify-between">
          <h2 className="text-[20px] sm:text-[24px] text-white font-['Titillium_Web:Bold',sans-serif]">
            Impostazioni Account
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 sm:py-8">
          {/* Account Info Section */}
          <div className="mb-8">
            <h3 className="text-[18px] sm:text-[20px] text-[#004d99] font-['Titillium_Web:Bold',sans-serif] mb-4">
              Informazioni Account
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-[#f0f7ff] rounded-lg border border-[#bfdfff]">
                <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[12px] sm:text-[14px] text-gray-600 font-['Titillium_Web:Regular',sans-serif]">
                    Nome
                  </p>
                  <p className="text-[16px] sm:text-[18px] text-[#004d99] font-['Titillium_Web:SemiBold',sans-serif]">
                    {userName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#f0f7ff] rounded-lg border border-[#bfdfff]">
                <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[12px] sm:text-[14px] text-gray-600 font-['Titillium_Web:Regular',sans-serif]">
                    Email
                  </p>
                  <p className="text-[16px] sm:text-[18px] text-[#004d99] font-['Titillium_Web:SemiBold',sans-serif]">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] sm:text-[20px] text-[#004d99] font-['Titillium_Web:Bold',sans-serif]">
                Le tue Preferenze
              </h3>
              <button
                onClick={onEditPreferences}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#004d99] transition-colors text-[14px] sm:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]"
              >
                <Edit className="w-4 h-4" />
                Modifica
              </button>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:SemiBold',sans-serif] mb-3">
                Interessi
              </h4>
              {userPreferences.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.interests.map((interestId) => {
                    // Trova la categoria corrispondente usando l'ID
                    const categoryInterest = CATEGORY_INTERESTS.find(cat => cat.id === interestId);
                    if (!categoryInterest) return null;

                    // Trova i dettagli della categoria dalle API (se disponibili)
                    const categoryDetails = categories?.result?.find(cat => cat.name === interestId);
                    const Icon = categoryInterest.icon;

                    return (
                      <div
                        key={interestId}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#e6f2ff] border border-[#0066cc] rounded-full"
                      >
                        <Icon className="w-4 h-4 text-[#0066cc]" />
                        <span className="text-[14px] sm:text-[15px] text-[#004d99] font-['Titillium_Web:SemiBold',sans-serif]">
                          {categoryDetails?.label || categoryInterest.name || interestId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[14px] sm:text-[16px] text-gray-500 font-['Titillium_Web:Italic',sans-serif]">
                  Nessun interesse selezionato
                </p>
              )}
            </div>

            {/* Travel Style */}
            <div className="mb-6">
              <h4 className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:SemiBold',sans-serif] mb-3">
                Stile di Viaggio
              </h4>
              {userPreferences.travelStyle ? (
                (() => {
                  const style = travelStylesMap[userPreferences.travelStyle];
                  if (!style) return null;
                  const Icon = style.icon;
                  return (
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#e6f2ff] border border-[#0066cc] rounded-lg inline-flex">
                      <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[15px] sm:text-[16px] text-[#004d99] font-['Titillium_Web:SemiBold',sans-serif]">
                        {style.name}
                      </span>
                    </div>
                  );
                })()
              ) : (
                <p className="text-[14px] sm:text-[16px] text-gray-500 font-['Titillium_Web:Italic',sans-serif]">
                  Nessuno stile selezionato
                </p>
              )}
            </div>

            {/* Dietary Needs */}
            <div>
              <h4 className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:SemiBold',sans-serif] mb-3">
                Esigenze Alimentari
              </h4>
              {userPreferences.dietaryNeeds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.dietaryNeeds.map((needId) => {
                    const need = dietaryOptionsMap[needId];
                    if (!need) return null;
                    const Icon = need.icon;
                    return (
                      <div
                        key={needId}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#e6f2ff] border border-[#0066cc] rounded-full"
                      >
                        <Icon className="w-4 h-4 text-[#0066cc]" />
                        <span className="text-[14px] sm:text-[15px] text-[#004d99] font-['Titillium_Web:SemiBold',sans-serif]">
                          {need.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[14px] sm:text-[16px] text-gray-500 font-['Titillium_Web:Italic',sans-serif]">
                  Nessuna esigenza alimentare specificata
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-5 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#004d99] transition-colors font-['Titillium_Web:SemiBold',sans-serif] text-[16px] sm:text-[18px]"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}