import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAowLqk1PyG7K0F4niUxb02k0TPrIU82L0",
    authDomain: "ecohealth-monitor-2026.firebaseapp.com",
    projectId: "ecohealth-monitor-2026",
    storageBucket: "ecohealth-monitor-2026.firebasestorage.app",
    messagingSenderId: "422826422254",
    appId: "1:422826422254:web:3e62b962f30f2f23bda8ff",
    measurementId: "G-G59Y3L4B1A" // Analytics will request this usually
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
