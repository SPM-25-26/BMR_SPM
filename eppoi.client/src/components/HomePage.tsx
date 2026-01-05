import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MessageCircle, X, Send, MapPin, Calendar, Navigation, Newspaper, Briefcase, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { getCategories, getDiscoverList, type Category, type DiscoverItem } from '../api/infoApi';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';
import { getMediaUrl } from '../config/constants';
import SettingsModal from './SettingsModal';
import { useApiDataLoader } from '../hooks/useApiDataLoader';

const DiscoverType = {
  Poi: 0,
  Event: 1,
  Article: 2,
  Organization: 3
} as const;

type DiscoverType = typeof DiscoverType[keyof typeof DiscoverType];

interface HomePageProps {
  user: {
    name: string;
    userName: string;
    email: string;
  };
  userPreferences: {
    interests: string[];
    travelStyle: string;
    dietaryNeeds: string[];
  };
  onLogout: () => void;
  onViewDetail: (item: any) => void;
}

interface Interest {
  name: string;
  icon: typeof Navigation;
  discoverType: DiscoverType;
}

export default function HomePage({ user, onLogout, userPreferences }: HomePageProps) {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Punti di interesse']);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [discoveryData, setDiscoveryData] = useState<Array<DiscoverItem> | null>(null);
  const [showWorkInProgressModal, setShowWorkInProgressModal] = useState(false);
  const [showLoadDiscoveryTypeErrorModal, setShowLoadDiscoveryTypeErrorModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      cachedCategories.current = categories;
    }
  });

  const cupraImages = useMemo(() => [
    getMediaUrl('/Media/Organization/mobile-home-00356330449-8569dd20-ac7c-48e7-a50b-acbe25da5c41.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-e6aaed31-1509-40d2-baf3-3c458900af03.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-435e0456-03cd-45d9-892d-bfc96c649ffd.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-aad1daeb-9faa-43a4-ad51-b028016766ae.webp'),
  ], []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % cupraImages.length);
  }, [cupraImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + cupraImages.length) % cupraImages.length);
  }, [cupraImages.length]);

  const interests: Interest[] = useMemo(() => [
    { name: 'Punti di interesse', icon: Navigation, discoverType: DiscoverType.Poi },
    { name: 'Eventi', icon: Calendar, discoverType: DiscoverType.Event },
    { name: 'Articoli', icon: Newspaper, discoverType: DiscoverType.Article },
    { name: 'Operatori economici', icon: Briefcase, discoverType: DiscoverType.Organization },
  ], []);

  const getSelectedDiscoverType = useCallback((): DiscoverType => {
    const selectedInterest = interests.find(i => selectedInterests.includes(i.name));
    return selectedInterest ? selectedInterest.discoverType : DiscoverType.Poi;
  }, [interests, selectedInterests]);

  const closeWorkInProgressModal = useCallback(() => {
    setShowWorkInProgressModal(false);
  }, []);

  const closeLoadDiscoveryTypeErrorModal = useCallback(() => {
    setShowLoadDiscoveryTypeErrorModal(false);
  }, []);

  const handleCardClick = useCallback((recommendation: DiscoverItem) => {
    const selectedDiscoveryType = getSelectedDiscoverType();
    if (selectedDiscoveryType === DiscoverType.Poi) {
      navigate('/detail?type=' + selectedDiscoveryType + '&id=' + recommendation.entityId);
      console.error('GO TO DETAIL');
    } else {
      setShowWorkInProgressModal(true);
    }
  }, [getSelectedDiscoverType, navigate]);

  const loadSelectedDiscoveryType = useCallback(async (selectedDiscoveryType: DiscoverType) => {
    try {
      const result = await getDiscoverList(selectedDiscoveryType);
      if (result) {
        setDiscoveryData(result.result.result);
      }
    } catch (error) {
      console.error('Errore nel caricamento della lista discover:', error);
    }
  }, []);

  const loadCurrentSelectedDiscoveryType = useCallback(async () => {
    await loadSelectedDiscoveryType(getSelectedDiscoverType());
  }, [loadSelectedDiscoveryType, getSelectedDiscoverType]);

  const loadMunicipalityData = useCallback(async () => {
    const result = await loadData(getCategories);
    if (result) {
      await loadCurrentSelectedDiscoveryType();
    }
  }, [loadData, loadCurrentSelectedDiscoveryType]);

  const handleRetry = useCallback(async () => {
    closeErrorModal();
    resetLoadingFlag();
    await loadMunicipalityData();
  }, [closeErrorModal, resetLoadingFlag, loadMunicipalityData]);

  const onEditPreferences = useCallback(() => {
    navigate('/onboarding');
  }, [navigate]);

  // Caricamento iniziale - usa un flag per eseguire solo al mount
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadMunicipalityData();
    }
  }, [loadMunicipalityData]);

  const toggleInterest = useCallback((interest: string) => {
    // Cannot deselect anything
    if (selectedInterests.includes(interest)) {
      return;
    }
    
    // Current selection change
    setSelectedInterests([interest]);
    const selectedInterest = interests.find(i => i.name === interest);
    if (selectedInterest) {
      loadSelectedDiscoveryType(selectedInterest.discoverType);
    }
  }, [selectedInterests, interests, loadSelectedDiscoveryType]);

  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { text: chatInput, isUser: true }]);
      
      setTimeout(() => {
        const responses = [
          'Ecco alcuni luoghi interessanti nelle vicinanze: il Duomo di Firenze, la Galleria degli Uffizi e Palazzo Vecchio.',
          'Ti consiglio di provare la Trattoria Mario per cibo tradizionale toscano, oppure il Mercato Centrale.',
          'Nelle vicinanze puoi visitare il Giardino di Boboli, un bellissimo parco storico con vista sulla città.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setChatInput('');
    }
  }, [chatInput]);

  const getFilteredContent = useCallback(() => {
    if (!discoveryData || !Array.isArray(discoveryData)) return [];

    return discoveryData.map(item => ({
      ...item,
      id: item.entityId,
      title: item.entityName,
      category: item.badgeText,
      location: item.address || 'Cupra Marittima',
      image: getMediaUrl(item.imagePath),
      date: item.date
    }));
  }, [discoveryData]);

  const filteredContent = useMemo(() => getFilteredContent(), [getFilteredContent]);

  // Pull-to-refresh: usa ref per evitare ricreazione listener
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      // Swipe down (pull-to-refresh gesture)
      if (touchEndY > touchStartY + 50) {
        loadMunicipalityData();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loadMunicipalityData]);

  if (isLoading) {
    return <LoadingSpinner message="Caricamento dati in corso..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#0066cc] hover:bg-[#bfdfff] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">Esci</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="w-full mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Welcome Section */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <h2 className="text-[#004d99] text-[22px] sm:text-[24px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-1 sm:mb-2">
              Ciao {user.name}!
            </h2>            		

            {/* Location Notice */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-5 flex items-center gap-3 sm:gap-4">
              <img
                src={getMediaUrl('/Media/Organization/logo-00356330449.png')}
                alt="Stemma Cupra Marittima"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                  <p className="text-[#004080] text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">
                    Stai visitando
                  </p>
                </div>
                <h3 className="text-[#004d99] text-[18px] sm:text-[20px] md:text-[24px] font-['Titillium_Web:Bold',sans-serif]">
                  Cupra Marittima
                </h3>
              </div>
            </div>
          </div>

          {/* Cupra Carousel */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <div className="h-48 sm:h-56 md:h-64 lg:h-80">
                  <img
                    src={cupraImages[currentSlide]}
                    alt={`Cupra Marittima ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
          </div>

          {/* Interests Filter */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-2 md:gap-3">
              {interests.map((interest) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.name);
                return (
                  <button
                    key={interest.name}
                    onClick={() => toggleInterest(interest.name)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-full text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors ${
                      isSelected
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-white text-[#004080] border-2 border-[#0066cc] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredContent.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} onClick={() => handleCardClick(rec)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 bg-[#0066cc] hover:bg-[#004d99] text-white p-3 sm:p-3 md:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-end sm:justify-end z-50 p-0 sm:p-4 md:p-6">
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-2xl w-full sm:w-full sm:max-w-md h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#0066cc] px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-full">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                </div>
                <div>
                  <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:Bold',sans-serif]">
                    Assistente AI
                  </h3>
                  <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-[#bfdfff] transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-3 sm:mt-4 md:mt-8">
                  <p className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] mb-3 sm:mb-4">
                    Ciao! Come posso aiutarti oggi?
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setChatInput('Cosa posso visitare vicino a me?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      💡 Cosa posso visitare vicino a me?
                    </button>
                    <button
                      onClick={() => setChatInput('Dove posso mangiare cibo tradizionale?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      🍝 Dove posso mangiare cibo tradizionale?
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[85%] md:max-w-[80%] px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg ${
                        msg.isUser
                          ? 'bg-[#0066cc] text-white'
                          : 'bg-gray-100 text-[#004080]'
                      }`}
                    >
                      <p className="text-[13px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-2.5 sm:p-3 md:p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#0066cc] hover:bg-[#004d99] text-white px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 bg-[#0066cc] hover:bg-[#004d99] text-white p-3 sm:p-3 md:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <Settings className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          userName={user.name}
          userEmail={user.email}
          userPreferences={userPreferences}
          onEditPreferences={onEditPreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Error Modal */}
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

      {/* Work In Progress Modal */}
      <ErrorModal
        isOpen={showWorkInProgressModal}
        title="Work in progress"
        message="Coming soon"
        onClose={closeWorkInProgressModal}
        cancelLabel="Chiudi"
      />

      {/* Load discovery type Modal error */}
      <ErrorModal
        isOpen={showLoadDiscoveryTypeErrorModal}
        title="Errore server"
        message="Errore durante il caricamento dei dati"
        onClose={closeLoadDiscoveryTypeErrorModal}
        onRetry={loadCurrentSelectedDiscoveryType}
        retryLabel="Riprova"
        cancelLabel="Chiudi"
      />
      
    </div>
  );
}

const RecommendationCard = memo(function RecommendationCard({ recommendation, onClick }: RecommendationCardProps) {
  const handleClick = useCallback(() => {
    onClick(recommendation);
  }, [onClick, recommendation]);

  return (
    <div onClick={handleClick} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="h-36 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
        <img
          src={recommendation.image}
          alt={recommendation.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 sm:p-3 md:p-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
            {recommendation.category}
          </span>
          {recommendation.date && (
            <div className="flex items-center gap-1 text-[#0066cc]">
              <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <span className="text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
                {recommendation.date}
              </span>
            </div>
          )}
        </div>
        <h4 className="text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:Bold',sans-serif] mb-1.5 sm:mb-2 overflow-hidden text-ellipsis line-clamp-2">
          {recommendation.title}
        </h4>
        {recommendation.location && (
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
              {recommendation.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});