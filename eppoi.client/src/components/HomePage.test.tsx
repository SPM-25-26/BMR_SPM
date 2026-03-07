import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const {
  mockNavigate,
  mockLoadData,
  mockRequestLocation,
  mockGetCategories,
  mockGetAllPois,
  mockCloseErrorModal,
  mockResetLoadingFlag,
  mockApiLoaderState,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLoadData: vi.fn(),
  mockRequestLocation: vi.fn(),
  mockGetCategories: vi.fn(),
  mockGetAllPois: vi.fn(),
  mockCloseErrorModal: vi.fn(),
  mockResetLoadingFlag: vi.fn(),
  mockApiLoaderState: {
    isLoading: false,
    errorState: null as { title: string; message: string } | null,
    showErrorModal: false,
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png', () => ({
  default: 'logo-mock.png',
}));

vi.mock('../api/infoApi', () => ({
  getCategories: mockGetCategories,
  getAllPois: mockGetAllPois,
  getDiscoverList: vi.fn(),
}));

vi.mock('../hooks/useApiDataLoader', () => ({
  useApiDataLoader: () => ({
    isLoading: mockApiLoaderState.isLoading,
    errorState: mockApiLoaderState.errorState,
    showErrorModal: mockApiLoaderState.showErrorModal,
    loadData: mockLoadData,
    closeErrorModal: mockCloseErrorModal,
    resetLoadingFlag: mockResetLoadingFlag,
  }),
}));

vi.mock('../hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    location: null,
    error: null,
    showErrorModal: false,
    closeErrorModal: vi.fn(),
    requestLocation: mockRequestLocation,
  }),
}));

vi.mock('../hooks/useDiscoveryScoring', () => ({
  useDiscoveryScoring: (data: unknown[] | null) => data ?? [],
}));

vi.mock('./RecommendationCard', () => ({
  default: ({
    recommendation,
    onClick,
  }: {
    recommendation: { id: string; name?: string };
    onClick: () => void;
  }) => (
    <button data-testid={`rec-${recommendation.id}`} onClick={onClick}>
      {recommendation.name ?? recommendation.id}
    </button>
  ),
}));

vi.mock('./ui/LoadingSpinner', () => ({
  default: () => <div>LOADING</div>,
}));

vi.mock('./ui/ErrorModal', () => ({
  default: ({
    isOpen,
    title,
    message,
    onClose,
    onRetry,
    retryLabel,
    cancelLabel,
  }: {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onRetry?: () => void;
    retryLabel?: string;
    cancelLabel?: string;
  }) =>
    isOpen ? (
      <div data-testid="error-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        {onRetry && <button onClick={onRetry}>{retryLabel ?? 'Riprova'}</button>}
        <button onClick={onClose}>{cancelLabel ?? 'Chiudi'}</button>
      </div>
    ) : null,
}));

vi.mock('./Chatbot', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div>CHATBOT_OPEN</div> : null),
}));

vi.mock('./ImageCarousel', () => ({
  default: () => <div>CAROUSEL</div>,
}));

vi.mock('./SettingsModal', () => ({
  default: () => <div>SETTINGS_MODAL</div>,
}));

import HomePage from './HomePage';

describe('HomePage', () => {
  beforeAll(() => {
    class IntersectionObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    mockApiLoaderState.isLoading = false;
    mockApiLoaderState.errorState = null;
    mockApiLoaderState.showErrorModal = false;

    mockLoadData
      .mockResolvedValueOnce([{ id: 'cat-1', name: 'Category 1' }])
      .mockResolvedValueOnce([{ id: '1', category: 'poi', name: 'POI 1' }]);

    Object.defineProperty(window, 'scrollY', {
      value: 250,
      writable: true,
      configurable: true,
    });
  });

  it('load startup data and ask for geolocation', async () => {
    render(
      <HomePage
        user={{ name: 'Mario', userName: 'mrossi', email: 'mario@example.com' }}
        userPreferences={{ interests: ['Sleep'], travelStyle: 'Relax', dietaryNeeds: [] }}
        onLogout={vi.fn()}
        onViewDetail={vi.fn()}
      />
    );

    expect(screen.getByText('Ciao Mario!')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockRequestLocation).toHaveBeenCalledTimes(1);
      expect(mockLoadData).toHaveBeenCalledTimes(2);
    });
  });

  it('navigate to detail and save scroll state at card click', async () => {
    render(
      <HomePage
        user={{ name: 'Mario', userName: 'mrossi', email: 'mario@example.com' }}
        userPreferences={{ interests: ['Mare'], travelStyle: 'Relax', dietaryNeeds: [] }}
        onLogout={vi.fn()}
        onViewDetail={vi.fn()}
      />
    );

    const card = await screen.findByTestId('rec-1');
    await userEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/detail?cat=poi&id=1');
    expect(sessionStorage.getItem('homepage_scroll_position')).toBe('250');
    expect(sessionStorage.getItem('homepage_displayed_items')).toBe('20');
  });

  it('calls onLogout when clicking "Esci"', async () => {
    const onLogout = vi.fn();

    render(
      <HomePage
        user={{ name: 'Mario', userName: 'mrossi', email: 'mario@example.com' }}
        userPreferences={{ interests: ['Mare'], travelStyle: 'Relax', dietaryNeeds: [] }}
        onLogout={onLogout}
        onViewDetail={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText('Esci'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('opens chatbot and settings modal from floating buttons', async () => {
    const { container } = render(
      <HomePage
        user={{ name: 'Mario', userName: 'mrossi', email: 'mario@example.com' }}
        userPreferences={{ interests: ['Mare'], travelStyle: 'Relax', dietaryNeeds: [] }}
        onLogout={vi.fn()}
        onViewDetail={vi.fn()}
      />
    );

    const chatbotButton = container.querySelector('button.fixed.bottom-3.right-3');
    const settingsButton = container.querySelector('button.fixed.bottom-3.left-3');

    expect(chatbotButton).toBeTruthy();
    expect(settingsButton).toBeTruthy();

    await userEvent.click(chatbotButton as HTMLButtonElement);
    expect(screen.getByText('CHATBOT_OPEN')).toBeInTheDocument();

    await userEvent.click(settingsButton as HTMLButtonElement);
    expect(screen.getByText('SETTINGS_MODAL')).toBeInTheDocument();
  });

  it('retries loading when error modal retry is clicked', async () => {
    mockApiLoaderState.errorState = {
      title: 'Errore server',
      message: 'Errore durante il caricamento dei dati',
    };
    mockApiLoaderState.showErrorModal = true;
    mockLoadData.mockReset();
    mockLoadData.mockResolvedValue([{ id: 'cat-1', name: 'Category 1' }]);

    render(
      <HomePage
        user={{ name: 'Mario', userName: 'mrossi', email: 'mario@example.com' }}
        userPreferences={{ interests: ['Mare'], travelStyle: 'Relax', dietaryNeeds: [] }}
        onLogout={vi.fn()}
        onViewDetail={vi.fn()}
      />
    );

    const retryButton = await screen.findByText('Riprova');
    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(mockCloseErrorModal).toHaveBeenCalledTimes(1);
      expect(mockResetLoadingFlag).toHaveBeenCalledTimes(1);
      expect(mockRequestLocation).toHaveBeenCalledTimes(2);
      expect(mockLoadData).toHaveBeenCalledTimes(4);
    });
  });
});