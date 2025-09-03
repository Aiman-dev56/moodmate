// ============================
// 🔹 Auth.js
// ============================
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Elements
const navbarUsername = document.getElementById("navbarUsername");
const userIcon = document.getElementById("userIcon");
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 Listen for Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ Logged in → show name or email prefix
    const displayName = user.displayName || user.email.split("@")[0];

    if (navbarUsername) navbarUsername.textContent = displayName;

    if (userIcon) {
      userIcon.textContent = displayName.charAt(0).toUpperCase();
      userIcon.classList.add("bg-primary", "text-white");
    }

    if (logoutBtn) logoutBtn.style.display = "block"; // show logout option
  } else {
    // ❌ Logged out → reset UI
    if (navbarUsername) navbarUsername.textContent = "Login";

    if (userIcon) {
      userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
      userIcon.classList.remove("bg-primary", "text-white");
    }

    if (logoutBtn) logoutBtn.style.display = "none"; // hide logout option

    // Redirect to login section
    if (window.location.pathname.endsWith("index.html")) {
      // if on home page → do nothing
    } else {
      window.location.href = "./html/register.html#loginSectionId";
    }
  }
});

// 🔹 Logout Function (called by dropdown)
window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("You have been logged out.");
    window.location.href = "./html/register.html#loginSectionId";
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
