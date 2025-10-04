import{ onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp,
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

 import { auth, db } from "./firebase.js";

// Quiz Questions
const quizQuestions = [
  {
    question: "How often have you felt cheerful and in good spirits in the last week?",
    options: ["Never", "Sometimes", "Often", "Always"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "How often have you felt calm and relaxed?",
    options: ["Never", "Sometimes", "Often", "Always"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Do you feel you are able to handle daily responsibilities?",
    options: ["No, not at all", "Partly", "Mostly", "Yes, completely"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Have you felt interested in your daily activities?",
    options: ["Not at all", "A little", "Quite a bit", "Very much"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "How well are you sleeping these days?",
    options: ["Very poorly", "Poorly", "Fairly well", "Very well"],
    scores: [0, 1, 2, 3]
  }
];

let currentQuestionIndex = 0;
let userAnswers = [];

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const questionCount = document.getElementById("questionCount");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// Load a question
function loadQuestion(index) {
  const question = quizQuestions[index];
  questionText.textContent = question.question;
  questionCount.textContent = `(${index + 1}/${quizQuestions.length})`;

  optionsContainer.innerHTML = "";
  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary d-block w-100 mb-2";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index, i, btn);
    if (userAnswers[index] === i) btn.classList.add("active");
    optionsContainer.appendChild(btn);
  });

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === quizQuestions.length - 1 ? "Finish" : "Next";
}

// When user selects answer
function selectAnswer(questionIndex, optionIndex, btn) {
  userAnswers[questionIndex] = optionIndex;

  // highlight
  [...optionsContainer.children].forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // 👇 Auto move to next question (if not last one)
  setTimeout(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
    } else {
      calculateResult();
    }
  }, 400); // small delay so user sees button highlight
}

// Next button manually
function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === undefined) {
    alert("⚠️ Please select an answer before continuing.");
    return;
  }
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  } else {
    calculateResult();
  }
}

// Prev button manually
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion(currentQuestionIndex);
  }
}

// Calculate result
async function calculateResult() {
  const totalScore = userAnswers.reduce((sum, ans, idx) => sum + quizQuestions[idx].scores[ans], 0);
  const maxScore = quizQuestions.length * 3;
  const percentage = (totalScore / maxScore) * 100;

  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const helpOptions = document.getElementById("helpOptions");

  let status;
  if (percentage >= 70) {
    resultTitle.textContent = "✅ You’re doing well!";
    resultText.textContent = "Your answers suggest good mental well-being. Keep up your healthy habits!";
    helpOptions.classList.add("d-none");
    status = "Good";
  } else {
    resultTitle.textContent = "⚠️ Take Care of Yourself";
    resultText.textContent = "Your answers suggest some stress or struggles. It might help to use tools like journaling, chatting with support, or relaxation exercises.";
    helpOptions.classList.remove("d-none");
    status = "Needs Support";
  }

  try {
    const user = auth.currentUser;
    if (user) {
      const resultsRef = collection(db, "users", user.uid, "quizResults");
      await addDoc(resultsRef, {
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        status: status,
        timestamp: serverTimestamp()
      });
      console.log("✅ Quiz result saved!");
    }
  } catch (err) {
    console.error("Error saving quiz result:", err.message);
  }

  const quizModal = bootstrap.Modal.getInstance(document.getElementById("quizModal"));
  quizModal.hide();

  const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
  resultModal.show();
}

// ✅ Attach button event listeners
nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);

// ✅ Handle redirect after result modal
document.getElementById("resultModal").addEventListener("hidden.bs.modal", () => {
  document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  window.location.href = "index.html";
});

document.getElementById("resultModal").addEventListener("shown.bs.modal", () => {
  setTimeout(() => {
    const modalEl = document.getElementById("resultModal");
    if (modalEl.classList.contains("show")) {
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      window.location.href = "index.html";
    }
  }, 3000); // auto redirect after 3s
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  loadQuestion(currentQuestionIndex);
});



const addReviewBtn = document.getElementById("addReviewBtn");
const reviewForm = document.getElementById("reviewForm");
const testimonialSlides = document.getElementById("testimonialSlides");
const carouselIndicators = document.getElementById("carouselIndicators");
const modalTitle = document.getElementById("reviewModalLabel");
const submitBtn = document.getElementById("reviewSubmitBtn");

let currentUser = null;
let editMode = null; // null = add, or docId = edit

// 🔹 Listen for login state
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  addReviewBtn.style.display = user ? "block" : "none";
});

// ==================
// Load & Render Reviews
// ==================
function loadReviews() {
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    testimonialSlides.innerHTML = "";
    carouselIndicators.innerHTML = "";

    let index = 0;
    snapshot.forEach((docSnap) => {
      const review = docSnap.data();
      const isOwner = currentUser && currentUser.uid === review.userId;

      // Pick gender icon
      let icon = "👤";
      if (review.gender === "male") icon = "👨";
      if (review.gender === "female") icon = "👩";

      const slide = `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <div class="card p-3 shadow">
            <h5>${icon} ${review.userName} ⭐${review.rating}</h5>
            <p>${review.text}</p>
            ${isOwner ? `
              <button class="btn btn-sm btn-outline-warning me-2" onclick="editReview('${docSnap.id}', \`${review.text}\`, ${review.rating})">Edit</button>
              <button class="btn btn-sm btn-outline-danger me-2 mt-3" onclick="deleteReview('${docSnap.id}')">Delete</button>
            ` : ""}
          </div>
        </div>`;

      testimonialSlides.innerHTML += slide;
      carouselIndicators.innerHTML += `
        <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}"></button>
      `;
      index++;
    });
  });
}
loadReviews();

// ==================
// Add / Edit Review Handler
// ==================
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return alert("You must be logged in!");

  const textarea = reviewForm.querySelector("textarea");
  const ratingInput = reviewForm.querySelector("input[type=number]");
  const text = textarea.value.trim();
  const rating = parseInt(ratingInput.value);

  if (editMode) {
    // update existing
    await updateDoc(doc(db, "testimonials", editMode), {
      text,
      rating
    });
  } else {
    // add new
    await addDoc(collection(db, "reviews"), {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      gender: "unknown", // optional: fetch from profile if saved
      text,
      rating,
      createdAt: new Date()
    });
  }

  // Reset modal state
  reviewForm.reset();
  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
  modalTitle.textContent = "Add Review";
  submitBtn.textContent = "Submit Review";
  editMode = null;
});

// ==================
// Delete Review
// ==================
window.deleteReview = async (id) => {
  if (confirm("Are you sure you want to delete this review?")) {
    await deleteDoc(doc(db, "reviews", id));
  }
};

// ==================
// Edit Review
// ==================
window.editReview = (id, oldText, oldRating) => {
  const textarea = reviewForm.querySelector("textarea");
  const ratingInput = reviewForm.querySelector("input[type=number]");

  textarea.value = oldText;
  ratingInput.value = oldRating;

  modalTitle.textContent = "Edit Review";
  submitBtn.textContent = "Save Changes";
  editMode = id;

  const modal = new bootstrap.Modal(document.getElementById("reviewModal"));
  modal.show();
};
