// ============================
// 🔹 Auth.js (Fixed)
// ============================
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Elements
const navbarUsername = document.getElementById("navbarUsername");
const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown"); 
const loginNavItem = document.getElementById("loginNavItem");

// 🔹 Helper: always return correct login page path
function getLoginPagePath() {
  const path = window.location.pathname;
  if (path.includes("/html/")) {
    return "../html/register.html#loginSectionId"; // if already inside /html/
  } else {
    return "./html/register.html#loginSectionId"; // if in root
  }
}

// 🔹 Listen for Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ Logged in
    const displayName = user.displayName || user.email.split("@")[0];
    if (navbarUsername) navbarUsername.textContent = displayName;
    if (userIcon) userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
    if (userDropdown) userDropdown.style.display = "block";
    if (loginNavItem) loginNavItem.style.display = "none";
  } else {
    // ❌ Logged out
    if (navbarUsername) navbarUsername.textContent = "User";
    if (userIcon) userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
    if (userDropdown) userDropdown.style.display = "none";
    if (loginNavItem) loginNavItem.style.display = "block";

    // 🔹 Redirect if not on home page
    const path = window.location.pathname;
    if (!(path.endsWith("index.html") || path.endsWith("/"))) {
      window.location.href = getLoginPagePath();
    }
  }
});

// 🔹 Logout Function
window.logoutUser = async function () {
  try {
    await signOut(auth);
    alert("You have been logged out.");
    window.location.href = getLoginPagePath();
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
