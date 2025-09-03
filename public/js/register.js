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

// ============================
// 🔹 DOM Elements
// ============================
const form = document.getElementById("registerForm");
const loginForm = document.getElementById("login-form")

//registration password + toggle
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const passwordReq = document.getElementById("passwordRequirements");

//login password + toggle

const loginPasswordInput = document.getElementById("loginPassword");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");


// ============================
// 🔹 Password Validation
// ============================
function validatePassword(password) {
  // Min 8 chars, 1 letter, 1 number, 1 special char
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

// Live check as user types
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;

  if (val.length < 8) {
    passwordReq.textContent = "Password must be at least 8 characters long.";
    passwordReq.classList.remove("d-none");
  } else if (!validatePassword(val)) {
    passwordReq.textContent = "Password must contain a letter, a number, and a special character.";
    passwordReq.classList.remove("d-none");
  } else {
    passwordReq.classList.add("d-none"); // ✅ Hide when valid
  }
});

// ============================
// 🔹 Toggle Show/Hide Password
// ============================
togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.classList.replace("bi-eye-slash", "bi-eye");
  } else {
    passwordInput.type = "password";
    togglePassword.classList.replace("bi-eye", "bi-eye-slash");
  }
});

//login from toggle

toggleLoginPassword?.addEventListener("click", () =>{
  if(loginPasswordInput.type === "password"){
    loginPasswordInput.type = "text";
    toggleLoginPassword.classList.replace("bi-eye-slash", "bi-eye");
  }else {
    loginPasswordInput.type = "password";
    toggleLoginPassword.classList.replace("bi-eye", "bi-eye-slash");
  }
});

// ============================
// 🔹 Handle Form Submit (Register)
// ============================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const country = document.getElementById("country").value.trim();
  const password = passwordInput.value;

  // Validate password before Firebase call
  if (!validatePassword(password)) {
    alert("❌ Please choose a stronger password (min 8 chars, letter, number, special char).");
    return;
  }

  try {
    // Firebase register
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      country: country,
      createdAt: new Date().toISOString()
    });

    alert("✅ Registration successful!");
    form.reset();
    passwordReq.classList.add("d-none");
  } catch (error) {
    console.error("Error:", error.message);
    alert("❌ " + error.message);
  }

   // ============================
    // ✅ Success Modal Logic
    // ============================
    document.getElementById("successMessage").textContent =
      `🎉 Registration Successful, Welcome ${name}!`;

    // Close registration modal if open
    const registerModalEl = document.getElementById("registerModal");
    if (registerModalEl) {
      const registerModal = bootstrap.Modal.getInstance(registerModalEl) || new bootstrap.Modal(registerModalEl);
      registerModal.hide();

      document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
      document.body.classList.remove("modal-open");
    }

    // Show success modal
    const successModalEl = document.getElementById("successModal");
    const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);
    successModal.show();

    // Countdown
    let countdown = 5;
    const countdownPopup = document.getElementById("countdownPopup");
    const popupCountdown = document.getElementById("popupCountdown");

    countdownPopup.classList.remove("d-none");
    popupCountdown.textContent = countdown;

    const interval = setInterval(() => {
      countdown--;
      popupCountdown.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        successModal.hide();
        setTimeout(() => {
          document.querySelector("#loginSectionId").scrollIntoView({ behavior: "smooth" });
          document.body.classList.remove("modal-open");
        }, 300);
      }
    }, 1000);

    // Continue button (manual skip)
    document.getElementById("continueBtn").onclick = () => {
      clearInterval(interval);
      successModal.hide();
      setTimeout(() => {
        document.querySelector("#loginSectionId").scrollIntoView({ behavior: "smooth" });
        document.body.classList.remove("modal-open");
      }, 300);
    };

    form.reset();
    passwordReq.classList.add("d-none");

});



//login user

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("login succes:", user);

    alert(`✅ Welcome back, ${user.email}`);
    console.log("redirecting to the index....");
window.location.href = "/public/index.html";
  } catch (error) {
    alert("❌ " + error.message);
  }
});


//forgot password

document.getElementById("forgotPassword").addEventListener("click", async () => {
  const email = prompt("Enter your registered email:");
  if(!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("📩 Password reset email sent!");
  } catch (error) {
    alert("❌ " + error.message);
  }
});


//google login

document.getElementById("googleLogin").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert(`✅ Logged in as ${result.user.displayName}`);
    window.location.href = "../index.html";
  } catch (error) {
    alert("❌ " + error.message);
    }
});


// apple login

document.getElementById("appleLogin").addEventListener("click", async() =>{
  const provider = new OAuthProvider("apple.com");
  try {
    const result = await signInWithPopup(auth, provider);
     alert(`✅ Logged in as ${result.user.displayName}`);
      window.location.href = "../index.html";
  } catch (error) {
     alert("❌ " + error.message);
  }
});
