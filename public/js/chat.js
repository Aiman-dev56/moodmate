// ==========================
// chat.js (Fake Chatbot)
// ==========================

// DOM elements
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatBtn");

let chats = JSON.parse(localStorage.getItem("moodmate_chats")) || [];
let activeChatId = null;

// ---------- UTILITIES ----------
function saveChats() {
  localStorage.setItem("moodmate_chats", JSON.stringify(chats));
}

function createMessageElement(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  return div;
}

// ---------- CHATBOT LOGIC ----------
function fakeBotReply(userMsg) {
  const lower = userMsg.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi")) {
    return "👋 Hello! How are you feeling today?";
  }
  if (lower.includes("sad")) {
    return "I'm sorry to hear that 😔. Want me to suggest some uplifting activities?";
  }
  if (lower.includes("happy")) {
    return "That's wonderful to hear! 🌟 Keep spreading positivity!";
  }
  if (lower.includes("depression")) {
    return "Depression can be tough. It's important to talk to someone you trust. You're not alone ❤️.";
  }

  // default response
  const responses = [
    "Interesting... tell me more!",
    "I understand 🤔",
    "That’s a good point!",
    "Can you explain a little further?",
    "Hmm, I’m listening carefully 👂"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ---------- MESSAGE FLOW ----------
function addMessageToChat(chatId, text, sender) {
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  chat.messages.push({ sender, text });
  saveChats();

  const msgEl = createMessageElement(text, sender);
  chatMessages.appendChild(msgEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text || !activeChatId) return;

  // Add user msg
  addMessageToChat(activeChatId, text, "user");
  userInput.value = "";

  // Bot reply after delay
  setTimeout(() => {
    const reply = fakeBotReply(text);
    addMessageToChat(activeChatId, reply, "bot");
  }, 600);
}

// ---------- CHAT MANAGEMENT ----------
function renderChatList() {
  chatList.innerHTML = "";
  chats.forEach(chat => {
    const item = document.createElement("div");
    item.classList.add("chat-item");
    item.textContent = chat.title;
    item.onclick = () => loadChat(chat.id);
    chatList.appendChild(item);
  });
}

function loadChat(chatId) {
  activeChatId = chatId;
  const chat = chats.find(c => c.id === chatId);

  document.getElementById("chatHeader").textContent = chat.title;
  chatMessages.innerHTML = "";

  chat.messages.forEach(msg => {
    const msgEl = createMessageElement(msg.text, msg.sender);
    chatMessages.appendChild(msgEl);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function newChat() {
  const newId = Date.now();
  const chat = {
    id: newId,
    title: "Chat " + (chats.length + 1),
    messages: []
  };
  chats.push(chat);
  saveChats();
  renderChatList();
  loadChat(newId);
}

// ---------- EVENT LISTENERS ----------
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
newChatBtn.addEventListener("click", newChat);

// ---------- INIT ----------
renderChatList();
if (chats.length > 0) {
  loadChat(chats[0].id);
} else {
  newChat();
}
