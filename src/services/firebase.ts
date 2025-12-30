import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot
} from 'firebase/firestore';
import {
    getAuth,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import type { Watchlist, Movie } from '../types';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return null;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Get current user ID (null if not logged in)
export const getCurrentUserId = (): string | null => {
    return auth.currentUser?.uid || null;
};

// Firestore document reference for authenticated user
export const getUserDocRef = (userId: string) => doc(db, 'users', userId);

// Save watchlists to Firestore
export const saveWatchlists = async (userId: string, watchlists: Watchlist[]) => {
    try {
        await setDoc(getUserDocRef(userId), { watchlists }, { merge: true });
    } catch (error) {
        console.error('Error saving watchlists:', error);
    }
};

// Save custom movies to Firestore
export const saveCustomMovies = async (userId: string, customMovies: Movie[]) => {
    try {
        await setDoc(getUserDocRef(userId), { customMovies }, { merge: true });
    } catch (error) {
        console.error('Error saving custom movies:', error);
    }
};

// User data type
interface UserData {
    watchlists: Watchlist[];
    customMovies: Movie[];
}

// Load user data from Firestore
export const loadUserData = async (userId: string): Promise<UserData> => {
    try {
        const docSnap = await getDoc(getUserDocRef(userId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                watchlists: data.watchlists || [],
                customMovies: data.customMovies || [],
            };
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    return { watchlists: [], customMovies: [] };
};

// Subscribe to real-time updates
export const subscribeToUserData = (
    userId: string,
    callback: (data: UserData) => void
) => {
    return onSnapshot(getUserDocRef(userId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            callback({
                watchlists: data.watchlists || [],
                customMovies: data.customMovies || [],
            });
        }
    }, (error) => {
        console.error('Error subscribing to user data:', error);
    });
};
