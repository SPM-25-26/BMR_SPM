import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Landmark,
  Newspaper,
  Hotel,
  Calendar,
  MapPin,
  Utensils,
  ShoppingBag,
  Sparkles,
  User,
  Users,
  UsersRound,
  WheatOff,
  Milk,
  Leaf,
  Trees,
  BriefcaseBusiness,
  Ham,
  Info
} from "lucide-react";
import logoImage from "figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png";
import { getCategories, updateUserPreferences, type Category } from '../api/infoApi';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';
import { useApiDataLoader } from '../hooks/useApiDataLoader';

interface OnboardingWizardProps {
  user: {
    name: string;
    userName: string;
    email: string;
  };
  userPreferences?: {
    interests: string[];
    travelStyle: string;
    dietaryNeeds: string[];
  } | null;
  onComplete: () => void;
  onLogout: () => void;
}

export default function OnboardingWizard({
  user,
  userPreferences,
  onComplete,
  onLogout
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    userPreferences?.interests || []
  );
  const [travelStyle, setTravelStyle] = useState<string>(
    userPreferences?.travelStyle || ""
  );
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>(
    userPreferences?.dietaryNeeds || []
  );
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const cachedCategories = useRef<Array<Category> | null>(null);

  const {
    isLoading,
    errorState,
    showErrorModal,
    loadData,
    closeErrorModal,
    resetLoadingFlag
  } = useApiDataLoader<Array<Category>>({
    onLogout,
    onSuccess: async (categories) => {
      cachedCategories.current = categories.result;
      console.error('Categories loaded for onboarding');
      console.log(cachedCategories.current);
    }
  });

  const {
    errorState: saveErrorState,
    showErrorModal: showSaveErrorModal,
    loadData: saveData,
    closeErrorModal: closeSaveErrorModal,
  } = useApiDataLoader<unknown>({
    onLogout,
    onSuccess: async () => {
      console.log('Preferenze utente salvate con successo');
      onComplete({ interests: selectedInterests, travelStyle: travelStyle, dietaryNeeds: dietaryNeeds });
    },
    customErrorMessages: {
      title: "Errore nel salvataggio",
      message: "Non è stato possibile salvare le tue preferenze. Verifica la connessione e riprova."
    }
  });

  /** This is to map categories with icons, because unfortunately icons by Eppoi webservices still don't work */
  const interests = [
    {
      id: "ArtCulture",
      icon: Landmark,
    },
    {
      id: "Articles",
      icon: Newspaper,
    },
    { id: "Sleep", icon: Hotel },
    { id: "Events", name: "Eventi", icon: Calendar },
    { id: "Routes", icon: MapPin },
    { id: "EatAndDrink", icon: Utensils },
    { id: "Nature", icon: Trees },
    { id: "Organizations", icon: BriefcaseBusiness },
    { id: "TypicalProducts", icon: Ham },
    { id: "Shopping", icon: ShoppingBag },
    { id: "Services", icon: Info },
    {
      id: "EntertainmentLeisure",
      icon: Sparkles,
    },
  ];

  const travelStyles = [
    { id: "solo", name: "Viaggiatore solitario", icon: User },
    { id: "coppia", name: "Coppia", icon: Users },
    { id: "famiglia", name: "Famiglia", icon: UsersRound },
    { id: "amici", name: "Gruppo di amici", icon: Users },
  ];

  const dietaryOptions = [
    { id: "celiachia", name: "Celiachia", icon: WheatOff },
    { id: "lattosio", name: "Senza lattosio", icon: Milk },
    { id: "vegetariano", name: "Vegetariano", icon: Leaf },
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId],
    );
  };

  const selectTravelStyle = (styleId: string) => {
    setTravelStyle(styleId);
  };

  const toggleDietaryNeed = (needId: string) => {
    setDietaryNeeds((prev) =>
      prev.includes(needId)
        ? prev.filter((id) => id !== needId)
        : [...prev, needId],
    );
  };

  const convertTravelStyleToEnum = (style: string): number => {
    const mapping: { [key: string]: number } = {
      'solo': 0,
      'coppia': 1,
      'famiglia': 2,
      'amici': 3
    };
    return mapping[style] ?? 0;
  };

  const saveUserPreferences = async () => {
    setIsSavingPreferences(true);
    try {
      await saveData(() => updateUserPreferences(user.userName, {
        interests: selectedInterests,
        travelStyle: convertTravelStyleToEnum(travelStyle),
        dietaryNeeds: dietaryNeeds
      }));
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and complete onboarding
      console.log("Onboarding completed:", {
        selectedInterests,
        travelStyle,
        dietaryNeeds,
      });
      await saveUserPreferences();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedInterests.length > 0;
    }
    return true; // Steps 2 and 3 are optional
  };

  const loadOnboardingData = useCallback(async () => {
    await loadData(getCategories);
  }, [loadData]);

  const handleRetry = async () => {
    closeErrorModal();
    resetLoadingFlag();
    await loadData(getCategories);
  };

  const handleSaveRetry = async () => {
    closeSaveErrorModal();
    await saveUserPreferences();
  };

  useEffect(() => {
    loadOnboardingData();
  }, [loadOnboardingData]);

  if (isLoading || isSavingPreferences) {
    return <LoadingSpinner message={isSavingPreferences ? "Salvataggio preferenze..." : "Caricamento dati in corso..."} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img
            src={logoImage}
            alt="Eppoi"
            className="h-5 sm:h-6 md:h-7"
          />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start w-full">
            {[
              { step: 1, label: "Interessi" },
              { step: 2, label: "Stile" },
              { step: 3, label: "Alimentazione" },
            ].map((item, index) => (
              <>
                <div
                  key={item.step}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentStep >= item.step
                        ? "bg-[#0066cc] text-white"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {currentStep > item.step ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-['Titillium_Web:SemiBold',sans-serif]">
                        {item.step}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[12px] sm:text-[14px] mt-2 whitespace-nowrap ${currentStep === item.step
                        ? 'text-[#0066cc] font-["Titillium_Web:SemiBold",sans-serif]'
                        : 'text-gray-600 font-["Titillium_Web:Regular",sans-serif]'
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    key={`bar-${item.step}`}
                    className={`flex-1 h-1 mx-3 mt-5 transition-all ${currentStep > item.step
                        ? "bg-[#0066cc]"
                        : "bg-gray-200"
                      }`}
                  />
                )}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Interests */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-[24px] sm:text-[28px] md:text-[32px] text-[#004d99] font-['Titillium_Web:Bold',sans-serif] mb-2">
                  Ciao {user?.name}! 👋
                </h1>
                <p className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:Regular',sans-serif]">
                  Personalizza la tua esperienza.
                  <br />
                  Quali sono i tuoi interessi?{" "}
                  <span className="text-[#d4183d]">*</span>
                </p>
                <p className="text-[14px] sm:text-[16px] text-gray-500 mt-2 font-['Titillium_Web:Italic',sans-serif]">
                  Seleziona almeno un'opzione
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {cachedCategories.current?.map((category) => {
                  // Find matching interes for icon
                  const matchingInterest = interests.find(
                    (interest) => interest.id === category.name
                  );
                  const Icon = matchingInterest?.icon;
                  const isSelected = selectedInterests.includes(
                    category.name,
                  );
                  return (
                    <button
                      key={category.name}
                      onClick={() =>
                        toggleInterest(category.name)
                      }
                      className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? "border-[#0066cc] bg-[#e6f2ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-[#0066cc] hover:shadow-md"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#0066cc] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${isSelected
                              ? "bg-[#0066cc]"
                              : "bg-[#e6f2ff]"
                            }`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected
                                  ? "text-white"
                                  : "text-[#0066cc]"
                                }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-[14px] sm:text-[16px] font-['Titillium_Web:SemiBold',sans-serif] ${isSelected
                              ? "text-[#004d99]"
                              : "text-gray-700"
                            }`}
                        >
                          {category.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Travel Style */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-[24px] sm:text-[28px] md:text-[32px] text-[#004d99] font-['Titillium_Web:Bold',sans-serif] mb-2">
                  Che tipo di viaggiatore sei?
                </h1>
                <p className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:Regular',sans-serif]">
                  Seleziona il tuo stile di viaggio preferito
                </p>
                <p className="text-[14px] sm:text-[16px] text-gray-500 mt-2 font-['Titillium_Web:Italic',sans-serif]">
                  Opzionale - puoi anche saltare questo
                  passaggio
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {travelStyles.map((style) => {
                  const Icon = style.icon;
                  const isSelected = travelStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() =>
                        selectTravelStyle(style.id)
                      }
                      className={`relative p-5 sm:p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? "border-[#0066cc] bg-[#e6f2ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-[#0066cc] hover:shadow-md"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#0066cc] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected
                              ? "bg-[#0066cc]"
                              : "bg-[#e6f2ff]"
                            }`}
                        >
                          <Icon
                            className={`w-7 h-7 sm:w-8 sm:h-8 ${isSelected
                                ? "text-white"
                                : "text-[#0066cc]"
                              }`}
                          />
                        </div>
                        <span
                          className={`text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] text-left ${isSelected
                              ? "text-[#004d99]"
                              : "text-gray-700"
                            }`}
                        >
                          {style.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Dietary Needs */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-[24px] sm:text-[28px] md:text-[32px] text-[#004d99] font-['Titillium_Web:Bold',sans-serif] mb-2">
                  Hai esigenze alimentari?
                </h1>
                <p className="text-[16px] sm:text-[18px] text-gray-700 font-['Titillium_Web:Regular',sans-serif]">
                  Aiutaci a consigliarti i posti giusti per te
                </p>
                <p className="text-[14px] sm:text-[16px] text-gray-500 mt-2 font-['Titillium_Web:Italic',sans-serif]">
                  Opzionale - puoi selezionare più opzioni o
                  nessuna
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto">
                {dietaryOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = dietaryNeeds.includes(
                    option.id,
                  );
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        toggleDietaryNeed(option.id)
                      }
                      className={`relative p-5 sm:p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? "border-[#0066cc] bg-[#e6f2ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-[#0066cc] hover:shadow-md"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#0066cc] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected
                              ? "bg-[#0066cc]"
                              : "bg-[#e6f2ff]"
                            }`}
                        >
                          <Icon
                            className={`w-7 h-7 sm:w-8 sm:h-8 ${isSelected
                                ? "text-white"
                                : "text-[#0066cc]"
                              }`}
                          />
                        </div>
                        <span
                          className={`text-[16px] sm:text-[18px] font-['Titillium_Web:SemiBold',sans-serif] text-left ${isSelected
                              ? "text-[#004d99]"
                              : "text-gray-700"
                            }`}
                        >
                          {option.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {dietaryNeeds.length === 0 && (
                <div className="text-center mt-6">
                  <p className="text-[14px] sm:text-[16px] text-gray-500 font-['Titillium_Web:Regular',sans-serif]">
                    Nessuna esigenza particolare? Nessun
                    problema! 😊
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 py-4 sm:py-5 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto flex gap-3 sm:gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-white text-[#0066cc] border-2 border-[#0066cc] rounded-lg hover:bg-[#f0f7ff] transition-colors font-['Titillium_Web:SemiBold',sans-serif] text-[16px] sm:text-[18px]"
            >
              <ArrowLeft className="w-5 h-5" />
              Indietro
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all font-['Titillium_Web:SemiBold',sans-serif] text-[16px] sm:text-[18px] ${canProceed()
                ? "bg-[#0066cc] text-white hover:bg-[#004d99] shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {currentStep === 3 ? "Completa" : "Avanti"}
            {currentStep < 3 && (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Error Modal for loading categories */}
      {errorState && (
        <ErrorModal
          isOpen={showErrorModal}
          title={errorState.title}
          message={errorState.message}
          onClose={closeErrorModal}
          onRetry={handleRetry}
          retryLabel="Riprova"
          cancelLabel="Chiudi"
        />
      )}

      {/* Error Modal for saving preferences */}
      {saveErrorState && (
        <ErrorModal
          isOpen={showSaveErrorModal}
          title={saveErrorState.title}
          message={saveErrorState.message}
          onClose={closeSaveErrorModal}
          onRetry={handleSaveRetry}
          retryLabel="Riprova"
          cancelLabel="Chiudi"
        />
      )}
    </div>
  );
}