import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  updateDoc, 
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const chatList = document.getElementById("chatList");
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

let currentUser = null;
let currentChatId = null;

/* ✅ Render messages in chat window */
function renderMessages(messages) {
  chatMessages.innerHTML = "";
  (messages || []).forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = msg.sender === "user" ? "text-end mb-2" : "text-start mb-2";
    msgDiv.innerHTML = `
      <span class="d-inline-block px-3 py-2 rounded ${msg.sender === "user" ? "bg-primary text-white" : "bg-light"}">
        ${msg.text}
      </span>
    `;
    chatMessages.appendChild(msgDiv);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ✅ Render sidebar chat list */
function renderChatList(chats) {
  chatList.innerHTML = "";
  chats.forEach(chat => {
    const btn = document.createElement("button");
    btn.className = "list-group-item list-group-item-action text-start";
    btn.textContent = chat.title;
    btn.onclick = () => {
      currentChatId = chat.id;
      renderMessages(chat.messages);
    };
    chatList.appendChild(btn);
  });
}

/* ✅ Start a new chat */
async function startNewChat() {
  if (!currentUser) return;

  const userChatsRef = collection(db, "users", currentUser.uid, "chats");

  const newChat = {
    title: `Chat ${new Date().toLocaleString()}`,
    messages: [
      {
        sender: "bot",
        text: `Hi ${currentUser.displayName || "Friend"}, how are you doing today?`,
        time: Date.now()
      }
    ],
    createdAt: Date.now()
  };

  const chatRef = await addDoc(userChatsRef, newChat);
  currentChatId = chatRef.id;
}

/* ✅ Add message (user or bot) */
async function addMessage(sender, text) {
  if (!currentChatId || !currentUser) return;

  const chatRef = doc(db, "users", currentUser.uid, "chats", currentChatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) return;

  const chatData = chatSnap.data();
  const messages = chatData.messages || [];

  messages.push({ sender, text, time: Date.now() });

  await updateDoc(chatRef, { messages });
}

/* ✅ Simple bot logic */
function botReply(userText) {
  let reply = "I'm here to support you 💙";
  if (userText.toLowerCase().includes("sad")) reply = "I'm sorry you're feeling sad. Want to talk about it?";
  if (userText.toLowerCase().includes("happy")) reply = "That's amazing! What made you happy today? 😊";
  if (userText.toLowerCase().includes("anxious")) reply = "Try a deep breath exercise 🌿. Do you want me to guide you?";
  addMessage("bot", reply);
}

/* ✅ Handle Send */
sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;
  await addMessage("user", text);
  userInput.value = "";
  setTimeout(() => botReply(text), 1000);
});

/* ✅ Enter = Send */
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

newChatBtn.addEventListener("click", startNewChat);

/* ✅ Listen for logged-in user and load chats */
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;

    const userChatsRef = collection(db, "users", user.uid, "chats");
    onSnapshot(userChatsRef, (snapshot) => {
      const chats = [];
      snapshot.forEach(docSnap => {
        chats.push({ id: docSnap.id, ...docSnap.data() });
      });
      renderChatList(chats);
      if (currentChatId) {
        const active = chats.find(c => c.id === currentChatId);
        if (active) renderMessages(active.messages);
      }
    });
  }
});