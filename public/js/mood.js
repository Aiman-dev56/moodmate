 import { auth, db } from "../js/firebase.js";
  import {
    doc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const suggestionMap = {
    happy: "You're feeling happy! Celebrate your wins today 🎉",
    sad: "Feeling sad? Try writing down what’s bothering you 📝",
    angry: "Breathe deeply. What caused your anger? 😤",
    anxious: "Try grounding exercises. What’s triggering the anxiety? 🌿",
    excited: "Channel that energy into something creative or adventurous 🎨✨",
    tired: "Rest is important! Consider taking a break or a short nap 😌",
    worried: "Try writing down what's worrying you and challenge those thoughts 🧠💭"
  };

  const moodButtons = document.querySelectorAll(".mood-button, .emoji-btn");
  const suggestionText = document.getElementById("moodSuggestion");
  const moodText = document.getElementById("moodText");
  const saveButton = document.getElementById("saveMood");
  const journalHistory = document.getElementById("journalHistory");

  let currentMood = "";
  let currentUser = null;

  moodButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMood = btn.dataset.mood;
      suggestionText.textContent =
        suggestionMap[currentMood] || "Describe how you feel.";
    });
  });

  function formatDateTime(date) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  // ✅ Render entries from Firestore
  async function renderEntries() {
    if (!currentUser) return;
    journalHistory.innerHTML = "";

    const q = query(
      collection(db, "users", currentUser.uid, "moodEntries"),
      orderBy("time", "desc")
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap, index) => {
      const entry = docSnap.data();
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <strong>${entry.mood}</strong>: ${entry.text}
        <br><small>${new Date(entry.time).toLocaleString()}</small>
        <span class="delete-btn" data-id="${docSnap.id}">Delete</span>
      `;
      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteEntry(docSnap.id);
      });
      journalHistory.appendChild(li);
    });
  }

  // ✅ Save entry to Firestore
  async function saveEntry() {
    const text = moodText.value.trim();
    if (!currentMood || !text) {
      alert("Please select a mood and write your thoughts.");
      return;
    }

    const entry = {
      mood: currentMood,
      text,
      time: Date.now()
    };

    try {
      await addDoc(collection(db, "users", currentUser.uid, "moodEntries"), entry);
      moodText.value = "";
      renderEntries();
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("❌ Could not save entry.");
    }
  }

  // ✅ Delete entry from Firestore
  async function deleteEntry(id) {
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "moodEntries", id));
      renderEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("❌ Could not delete entry.");
    }
  }

  // ✅ Attach save button
  saveButton.addEventListener("click", saveEntry);

  // ✅ Auth state listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      renderEntries();
    } else {
      currentUser = null;
      journalHistory.innerHTML =
        "<li class='list-group-item'>Please log in to view your journal entries.</li>";
    }
  });