// ============================
// 🔹 Firebase Setup
// ============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, 
  createUserWithEmailAndPassword,
signInWithEmailAndPassword,
sendPasswordResetEmail,
GoogleAuthProvider,
signInWithPopup,
OAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Your Firebase Config
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
const auth = getAuth(app);
const db = getFirestore(app);


//dom

function initializeAuth(options = {}) {
  const loginRedirect = options.loginRedirect || "./html/regiter.html#loginSectionId";
  const showName = options.showName !== false;

  //firebase listner for auth state

  firebaseConfig.auth().onAuthStateChanged((user) => {
    const usernamespan = document.getElementById("navbarUsername");
    const logoutBtn = document.getElementById("logoutBtn");

    if(user) {
      //user is logged in

      const displayName = user.displayName || user.email.split("@")[0];

      if(showName && usernamespan) {
        usernamespan.textContent = displayName;
      }
      
      if(logoutBtn){
        logoutBtn.addEventListener("click", async () => {
          await firebase.auth().signout();
          window.location.href = loginRedirect;
        });
      }
    } else {
      //no user loggedin in -> redirect to login

      if(usernamespan) {
        usernamespan.textContent = "Login";
        usernamespan.addEventListener("click", () => {
          Window.location.href = loginRedirect;
        });
      }
      window.location.href = loginRedirect;
    }
  });
}