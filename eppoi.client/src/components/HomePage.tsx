import { Navigation, Calendar, Newspaper, Briefcase, MapPin, Loader2, LogOut, MessageCircle, Settings } from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';
import { STORAGE_CATEGORIES_KEY, STORAGE_POIS_KEY } from '../api/apiUtils';
import { getCategories, getDiscoverList, type Category, type DiscoverItem, getAllPois } from '../api/infoApi';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorModal from './ui/ErrorModal';
import { getMediaUrl } from '../config/constants';
import SettingsModal from './SettingsModal';
import { useApiDataLoader } from '../hooks/useApiDataLoader';
import RecommendationCard from './RecommendationCard';
import Chatbot from './Chatbot';
import ImageCarousel from './ImageCarousel';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDiscoveryScoring } from '../hooks/useDiscoveryScoring';

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

const ITEMS_PER_PAGE = 20;
const SCROLL_POSITION_KEY = 'homepage_scroll_position';
const DISPLAYED_ITEMS_KEY = 'homepage_displayed_items';

export default function HomePage({ user, onLogout, userPreferences }: HomePageProps) {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Punti di interesse']);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [discoveryData, setDiscoveryData] = useState<Array<DiscoverItem> | null>(null);
  const [showWorkInProgressModal, setShowWorkInProgressModal] = useState(false);
  const [showLoadDiscoveryTypeErrorModal, setShowLoadDiscoveryTypeErrorModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [displayedItemsCount, setDisplayedItemsCount] = useState(() => {
    const saved = sessionStorage.getItem(DISPLAYED_ITEMS_KEY);
    return saved ? parseInt(saved, 10) : ITEMS_PER_PAGE;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollRestoredRef = useRef(false);

  const [categories, setCategories] = useState<Array<Category> | null>(null);
  const cachedPois = useRef<Array<DiscoverItem> | null>(null);

  // Usa il custom hook per la geolocalizzazione
  const {
    location: userLocation,
    error: gpsError,
    showErrorModal: showGpsErrorModal,
    closeErrorModal: closeGpsErrorModal,
    requestLocation
  } = useGeolocation();

  const { 
    isLoading, 
    errorState, 
    showErrorModal, 
    loadData, 
    closeErrorModal, 
    resetLoadingFlag 
  } = useApiDataLoader<Array<Category>>({ 
    onLogout,
    onSuccess: async () => {
      // Handled directly on returned result of loadData
    }
  });

  const cupraImages = useMemo(() => [
    getMediaUrl('/Media/Organization/mobile-home-00356330449-8569dd20-ac7c-48e7-a50b-acbe25da5c41.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-e6aaed31-1509-40d2-baf3-3c458900af03.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-435e0456-03cd-45d9-892d-bfc96c649ffd.webp'),
    getMediaUrl('/Media/Organization/mobile-home-00356330449-aad1daeb-9faa-43a4-ad51-b028016766ae.webp'),
  ], []);

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
    sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
    sessionStorage.setItem(DISPLAYED_ITEMS_KEY, displayedItemsCount.toString());    
    navigate('/detail?cat=' + recommendation.category + '&id=' + recommendation.id);
  }, [navigate, displayedItemsCount]);

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
    // Richiedi la posizione GPS tramite il custom hook
    requestLocation();

    const categoriesOutput = await loadData(getCategories, { localStorageKey: STORAGE_CATEGORIES_KEY });
    setCategories(categoriesOutput || null);

    if (categoriesOutput) {
      const poisResult = await loadData(getAllPois, { localStorageKey: STORAGE_POIS_KEY });
      cachedPois.current = poisResult;
      setDiscoveryData(cachedPois.current);      
    }
  }, [loadData, requestLocation]);

  const handleRetry = useCallback(async () => {
    closeErrorModal();
    resetLoadingFlag();
    await loadMunicipalityData();
  }, [closeErrorModal, resetLoadingFlag, loadMunicipalityData]);

  const onEditPreferences = useCallback(() => {
    navigate('/onboarding');
  }, [navigate]);

  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadMunicipalityData();
    }
  }, [loadMunicipalityData]);

  const toggleInterest = useCallback((interest: string) => {
    if (selectedInterests.includes(interest)) {
      return;
    }
    
    setSelectedInterests([interest]);
    const selectedInterest = interests.find(i => i.name === interest);
    if (selectedInterest) {
      loadSelectedDiscoveryType(selectedInterest.discoverType);
    }
  }, [selectedInterests, interests, loadSelectedDiscoveryType]);  

  // Get all filtered and sorted content - MEMOIZED
  // Sostituisci tutto il blocco allSortedItems con:
  const allSortedItems = useDiscoveryScoring(discoveryData, userLocation, userPreferences);
  
  // Get currently displayed items based on displayedItemsCount
  const displayedContent = useMemo(() => {
    return allSortedItems.slice(0, displayedItemsCount);
  }, [allSortedItems, displayedItemsCount]);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore) return;
    
    const totalItems = allSortedItems.length;
    if (displayedItemsCount >= totalItems) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay (rimuovi in produzione se non necessario)
    setTimeout(() => {
      setDisplayedItemsCount(prev => Math.min(prev + ITEMS_PER_PAGE, totalItems));
      setIsLoadingMore(false);
    }, 500);
  }, [displayedItemsCount, isLoadingMore, allSortedItems.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreItems]);

  // Restore previous scroll position, if se
  useEffect(() => {
    if (!scrollRestoredRef.current && displayedContent.length > 0 && !isLoading) {
      const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
      if (savedPosition) {
        // Usa requestAnimationFrame per assicurarsi che il DOM sia renderizzato
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
          // Pulisci dopo il ripristino
          sessionStorage.removeItem(SCROLL_POSITION_KEY);
        });
      }
      scrollRestoredRef.current = true;
    }
  }, [displayedContent.length, isLoading]);

  useEffect(() => {
    // Resetta solo se non c'è una posizione salvata (navigazione nuova, non ritorno)
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (!savedPosition) {
      setDisplayedItemsCount(ITEMS_PER_PAGE);
    }
  }, [discoveryData]);

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

  const hasMoreItems = displayedItemsCount < allSortedItems.length;

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
            <ImageCarousel images={cupraImages} altPrefix="Cupra Marittima" />
          </div>

          {/* Interests Filter */}
          {/* For now disabled */}
          <div className="mb-5 sm:mb-6 md:mb-8" style={{ display: 'none' }}>
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

          <h3 className="text-[#004d99] text-[18px] sm:text-[20px] md:text-[28px] font-['Titillium_Web:Bold',sans-serif] mb-3 sm:mb-4">
            Scopri i punti di interesse più vicini al tuo stile di viaggio:
          </h3>
          <hr className="border-[#bfdfff] mb-5 sm:mb-6 md:mb-8" />

          {/* Recommendations */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {displayedContent.map((rec, index) => (
                <RecommendationCard 
                  key={`${rec.id}-${index}`} 
                  recommendation={rec} 
                  onClick={() => handleCardClick(rec)}
                  userPreferences={userPreferences}
                />
              ))}
            </div>

            {/* Loader Trigger & Spinner */}
            {hasMoreItems && (
              <div 
                ref={loaderRef} 
                className="flex items-center justify-center py-8 sm:py-10 md:py-12"
              >
                {isLoadingMore && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#0066cc] animate-spin" />
                    <p className="text-[#004d99] text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">
                      Caricamento...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* End of Results Message */}
            {!hasMoreItems && displayedContent.length > 0 && (
              <div className="flex items-center justify-center py-8 sm:py-10 md:py-12">
                <p className="text-gray-500 text-[14px] sm:text-[15px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif]">
                  Hai visualizzato tutti i risultati
                </p>
              </div>
            )}
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
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onLogout={onLogout} />

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
          categories={categories}
          onEditPreferences={onEditPreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* GPS Error Modal */}
      {gpsError && (
        <ErrorModal
          isOpen={showGpsErrorModal}
          title={gpsError.title}
          message={gpsError.message}
          onClose={closeGpsErrorModal}
          cancelLabel="Chiudi"
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
