//user name


  const currentUserEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const navbarUsername = document.getElementById("navbarUsername");
  const userIcon = document.getElementById("userIcon");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUserEmail && users[currentUserEmail]) {
    const userName = users[currentUserEmail].name || "User";
    navbarUsername.textContent = userName;

    // Use initials instead of icon
    const initials = userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
    userIcon.textContent = initials;
    userIcon.classList.remove("bi", "bi-person-circle");
  } else {
    // Not logged in
    navbarUsername.textContent = "Login";
    userIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;

    // Make "Login" button clickable to open registration page
    document.getElementById("navbarUser").addEventListener("click", function () {
      window.location.href = "html/register.html#loginSectionId";
    });
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "html/register.html#loginSectionId";
    });
  }














//slide bar
function openSidebar() {
    document.getElementById("sidebar").style.width = "25%";
  }

  function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
  }



  //quiz
  const questions = [
    {
      text: "How often do you feel stressed?",
      options: ["Rarely", "Sometimes", "Often", "Always"],
      scores: [0, 1, 2, 3]
    },
    {
      text: "Do you feel energized during the day?",
      options: ["Always", "Most of the time", "Rarely", "Never"],
      scores: [0, 1, 2, 3]
    },
    {
      text: "How well do you sleep at night?",
      options: ["Very well", "Okay", "Poor", "Very Poor"],
      scores: [0, 1, 2, 3]
    },
    {
      text: "Do you enjoy activities you used to love?",
      options: ["Yes, very much", "A little", "Not much", "Not at all"],
      scores: [0, 1, 2, 3]
    },
    {
      text: "How connected do you feel to people around you?",
      options: ["Very connected", "Somewhat", "Not really", "Very isolated"],
      scores: [0, 1, 2, 3]
    }
  ];
  
  let currentQuestion = 0;
  let answers = [];
  
  function renderQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('questionCount').textContent = `(${currentQuestion + 1}/${questions.length})`;
  
    const optionsHtml = question.options.map((opt, i) => `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="option" id="opt${i}" value="${i}" ${answers[currentQuestion] === i ? 'checked' : ''}>
        <label class="form-check-label" for="opt${i}">${opt}</label>
      </div>
    `).join('');
    document.getElementById('optionsContainer').innerHTML = optionsHtml;
  
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').textContent = currentQuestion === questions.length - 1 ? "Submit" : "Next";
  }
  
  function nextQuestion() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return alert("Please select an option!");
  
    answers[currentQuestion] = parseInt(selected.value);
  
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showResult();
      const modal = bootstrap.Modal.getInstance(document.getElementById('quizModal'));
      modal.hide();
    }
  }
  
  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  }
  
  function showResult() {
    const totalScore = answers.reduce((acc, val, i) => acc + questions[i].scores[val], 0);
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const successSound = document.getElementById('successSound');
    const helpSound = document.getElementById('helpSound');
  
    if (totalScore <= 4) {
      document.getElementById('resultTitle').textContent = "🎉 Great!";
      document.getElementById('resultText').textContent = "You seem to have a healthy mental state. Keep taking care of yourself!";
      document.getElementById('helpOptions').classList.add('d-none');
      successSound.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      document.getElementById('resultTitle').textContent = "💡 Let's Work on It!";
      document.getElementById('resultText').textContent = "Here are some ways you can improve your mental well-being:";
      document.getElementById('helpOptions').classList.remove('d-none');
      helpSound.play();
    }
  
    resultModal.show();
  }
  
  document.getElementById('quizModal').addEventListener('shown.bs.modal', () => {
    currentQuestion = 0;
    answers = [];
    renderQuestion();
  });

  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];


  
  
 
 