// ============================
// 🔹 Firebase Setup
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxtk7rTwEBPT1W73scgPAMOsLrFXRaXVU",
  authDomain: "mood-mate-7d071.firebaseapp.com",
  projectId: "mood-mate-7d071",
  storageBucket: "mood-mate-7d071.appspot.com",
  messagingSenderId: "1043535041128",
  appId: "1:1043535041128:web:19f578531ba6dce4fa21dd",
  measurementId: "G-WSW5BQZGYR"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Services
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export for other files
export { auth, db };