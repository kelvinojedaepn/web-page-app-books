// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2wrBPmdwN0XZ_9JDj1QQKtMJiJhPr97g",
    authDomain: "web-page-back.firebaseapp.com",
    projectId: "web-page-back",
    storageBucket: "web-page-back.appspot.com",
    messagingSenderId: "647349184443",
    appId: "1:647349184443:web:c5a1b5cf14473e74c0069e"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

// Export
export default appFirebase;