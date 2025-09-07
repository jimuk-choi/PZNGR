// Firebase 설정 파일
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC0j8n6NWSmO6lg7Diw3_VZFosou-RRPmw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pzngr-43a3c.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "pzngr-43a3c",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pzngr-43a3c.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "975495132130",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:975495132130:web:7dd987b2038a24128dffbb",
  measurementId: "G-G5YRM2W1YS"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase Storage 인스턴스
export const storage = getStorage(app);

export default app;