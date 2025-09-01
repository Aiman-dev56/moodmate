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

//dom elements

const navbarUsername = document.getElementById("navbarUsername");
const userIcon = document.getElementById("userIcon");
const logoutBtn = document.getElementById("logoutBtn");
const navbarUser = document.getElementById("navbarUser");

//watch auth state

onAuthStateChange(auth, (user) =>{
  if (user){
    // logged in 

    const userName = user.displayName || user.email || "User";
    navbarUsername.textContent = userName;


    // initials
    const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase();
    userIcon.textContent = initials;
    userIcon.classList.remove("bi", "bi-person-circle");

    logoutBtn.classList.remove("d-none");
  } else {
    //not logged in

    navbarUsername.textContent = "Login";
    userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
    logoutBtn.classList.add("d-none");

    // clicking redirects to login page
    navbarUser.addEventListener("click", () => {
      window.location.href = "html/register.html#loginSectionId";
    });
  }
});

//logout 
logoutBtn.addEventListener("click", async () => {
  await SIGN_OUT_SCOPES(auth);
  window.location.href = "html/register.html#loginSectionId";
});