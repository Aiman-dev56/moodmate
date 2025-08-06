// js/auth.js

function initializeAuth(options = {}) {
    const loginRedirect = options.loginRedirect || "./html/register.html#loginSectionId";
    const showName = options.showName !== false;
  
    const currentUserEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "{}");
  
    if (!currentUserEmail || !users[currentUserEmail]) {
      window.location.href = loginRedirect;
      return;
    }
  
    const user = users[currentUserEmail];
    const usernameSpan = document.getElementById("navbarUsername");
  
    if (showName && usernameSpan) {
      usernameSpan.textContent = user.name;
    }
  
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = loginRedirect;
      });
    }
  }
  