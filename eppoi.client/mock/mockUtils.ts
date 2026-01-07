// In-memory storage shared by all mocks - it uses 'globalThis' to avoid re-istantiations
if (!globalThis.__mockStorage) {
  globalThis.__mockStorage = new Map<string, any>();
}

export const mockStorage = globalThis.__mockStorage as Map<string, any>;

// Verifica se l'uso dei mock è abilitato
export const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';