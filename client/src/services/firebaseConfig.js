import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCTu85spU60YICwlpnqMn-KhcSZMs9hol4",
    authDomain: "meet-auth-54bf9.firebaseapp.com",
    projectId: "meet-auth-54bf9",
    storageBucket: "meet-auth-54bf9.firebasestorage.app",
    messagingSenderId: "333207858692",
    appId: "1:333207858692:web:3932f4bb6b046166378f51"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error during sign-in:', error);
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error during sign-out:', error);
    }
};

export { auth };
