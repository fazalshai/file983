import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";  // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyC3yPWpajMxH4UTJZiP5QJ0mCC_EuOJR9E",
  authDomain: "fileverse-krwk3.firebaseapp.com",
  projectId: "fileverse-krwk3",
  storageBucket: "fileverse-krwk3.firebasestorage.app",
  messagingSenderId: "728331522699",
  appId: "1:728331522699:web:f363707ea1816e559cfa8e",
  measurementId: "G-03C72HRYJG",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
