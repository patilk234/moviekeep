import '@testing-library/jest-dom';

// Mock Firebase SDK packages BEFORE they're imported
// This prevents the SDK from initializing and making network calls
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
    onSnapshot: vi.fn(() => () => { }),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    onAuthStateChanged: vi.fn((_, callback) => {
        callback(null);
        return () => { };
    }),
}));

// Mock Firebase service before any tests run
vi.mock('../services/firebase', () => ({
    db: {},
    auth: {},
    saveWatchlists: vi.fn(),
    saveCustomMovies: vi.fn(),
    loadUserData: vi.fn().mockResolvedValue({ watchlists: [], customMovies: [] }),
    subscribeToUserData: vi.fn().mockReturnValue(() => { }),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    onAuthChange: vi.fn((callback) => {
        callback(null);
        return () => { };
    }),
    getCurrentUserId: vi.fn().mockReturnValue(null),
    getUserDocRef: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    },
});

// Reset mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
});
