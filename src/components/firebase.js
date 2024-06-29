// firebase.js
// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    // apiKey: "AIzaSyB3d1E1HNyQPfKlSNbhdOxC3xFeGVPTnv8",
    // authDomain: "chatchat-2bbc1.firebaseapp.com",
    // projectId: "chatchat-2bbc1",
    // storageBucket: "chatchat-2bbc1.appspot.com",
    // messagingSenderId: "915069736551",
    // appId: "1:915069736551:web:8bbe6d75a9bcffbd3ee6c2",
    // measurementId: "G-HCS2P1PPSW"
    apiKey: "AIzaSyCU7mk3-IY2dh4mhOT78zBGAFEG1ghYDoE",
    authDomain: "hello-1045a.firebaseapp.com",
    projectId: "hello-1045a",
    storageBucket: "hello-1045a.appspot.com",
    messagingSenderId: "165509649832",
    appId: "1:165509649832:web:36936d8f6f7ad36d46799d",
    measurementId: "G-3JEW9RJZH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
