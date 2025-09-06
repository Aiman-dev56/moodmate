// ============================
// 🔹 Auth.js
// ============================
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Elements
const navbarUsername = document.getElementById("navbarUsername");
const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown"); 
const loginNavItem = document.getElementById("loginNavItem"); 

// 🔹 Listen for Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ Logged in
    const displayName = user.displayName || user.email.split("@")[0];

    if (navbarUsername) navbarUsername.textContent = displayName;

    if (userIcon) {
      userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`; // keep clean icon
    }

    if (userDropdown) userDropdown.style.display = "block"; // show dropdown
    if (loginNavItem) loginNavItem.style.display = "none"; // hide login btn

  } else {
    // ❌ Logged out
    if (navbarUsername) navbarUsername.textContent = "User";

    if (userIcon) {
      userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
    }

    if (userDropdown) userDropdown.style.display = "none"; // hide dropdown
    if (loginNavItem) loginNavItem.style.display = "block"; // show login btn

    // Redirect to login page if not on index
    const path = window.location.pathname;
    if (!(path.endsWith("index.html") || path.endsWith("/"))) {
      window.location.href = "./html/register.html#loginSectionId";
    }
  }
});

// 🔹 Logout Function
window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("You have been logged out.");
    window.location.href = "./html/register.html#loginSectionId";
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
