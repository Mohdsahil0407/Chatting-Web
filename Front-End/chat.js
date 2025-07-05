// ✅ View height adjustment
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh * 100}px`);
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
document.addEventListener('DOMContentLoaded', setViewportHeight);
setInterval(setViewportHeight, 1000);

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
document.addEventListener('DOMContentLoaded', setViewportHeight);
setInterval(setViewportHeight, 1000); // extra safety

// ✅ Scroll to bottom
function scrollToBottom() {
  const chatBody = document.getElementById("chat-body");
  requestAnimationFrame(() => {
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}

// ✅ Scroll to bottom on input focus (mobile fix)
const input = document.getElementById("message-input");
input.addEventListener("focus", () => {
  setTimeout(scrollToBottom, 300);
});

// Dummy friend data
const myFriends = [
  { username: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { username: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { username: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" }
];

// Dummy all users (for global search)
const allUsers = [
  ...myFriends,
  { username: "Sahil", avatar: "https://i.pravatar.cc/150?img=4" },
  { username: "Tanya", avatar: "https://i.pravatar.cc/150?img=5" }
];

let selectedFriend = null;

// Render friend list
function renderFriends(list = myFriends) {
  const friendList = document.getElementById("friend-list");
  friendList.innerHTML = "";
  list.forEach(friend => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${friend.avatar}" /><span>${friend.username}</span>`;
    li.onclick = () => selectFriend(friend.username);
    friendList.appendChild(li);
  });
}
renderFriends();

// Sidebar friend search
document.getElementById("friend-search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = myFriends.filter(f => f.username.toLowerCase().includes(q));
  renderFriends(filtered);
});

// Global user search
document.getElementById("global-search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const resultBox = document.getElementById("global-search-results");
  resultBox.innerHTML = "";

  if (!q) return;

  const results = allUsers.filter(
    u => u.username.toLowerCase().includes(q) && !myFriends.some(f => f.username === u.username)
  );

  results.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.onclick = () => {
      window.location.href = `profile.html?username=${user.username}`;
    };
    resultBox.appendChild(li);
  });
});

// Select a friend to start chat
function selectFriend(username) {
  selectedFriend = username;
  document.getElementById("chat-body").innerHTML = "";
  document.getElementById("chat-footer").style.display = "flex";

  const msg = document.createElement("p");
  msg.className = "placeholder";
  msg.textContent = `Chatting with ${username}`;
  document.getElementById("chat-body").appendChild(msg);

  if (window.innerWidth <= 768) {
    document.querySelector(".sidebar").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
  }

  scrollToBottom();
}

// Send message
function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  if (!message || !selectedFriend) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper align-right";

  const dot = document.createElement("span");
  dot.className = "message-dot";
  dot.textContent = "⋮";

  const dropdown = document.createElement("div");
  dropdown.className = "message-dropdown";
  dropdown.innerHTML = `
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  dot.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  };
  document.addEventListener("click", () => dropdown.style.display = "none");

  const msgDiv = document.createElement("div");
  msgDiv.className = "message message-right";
  msgDiv.innerHTML = `<p>${message}<span class="msg-time">${time}</span></p>`;

  dropdown.querySelector(".edit-btn").onclick = () => {
    input.value = message;
    wrapper.remove();
    input.focus();
  };
  dropdown.querySelector(".delete-btn").onclick = () => wrapper.remove();

  wrapper.appendChild(dot);
  wrapper.appendChild(dropdown);
  wrapper.appendChild(msgDiv);

  const chatBody = document.getElementById("chat-body");
  chatBody.appendChild(wrapper);
  input.value = "";
  input.focus();

  scrollToBottom(); // ✅ Scroll after sending

  // Simulate reply
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "message message-left";
    reply.innerHTML = `<p>Reply from ${selectedFriend}<span class="msg-time">${time}</span></p>`;
    chatBody.appendChild(reply);
    scrollToBottom(); // ✅ Scroll after receiving
  }, 1000);
}

// Hamburger menu
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");
const toggleBtn = document.getElementById("menu-toggle");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
});
document.addEventListener("click", function (e) {
  if (
    window.innerWidth <= 768 &&
    !sidebar.contains(e.target) &&
    !toggleBtn.contains(e.target) &&
    !e.target.closest(".sidebar")
  ) {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  }
});

// Enter = Send, Shift+Enter = New line
document.getElementById("message-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Emoji Picker
let emojiMenu;
document.getElementById("emoji-btn").addEventListener("click", (e) => {
  e.stopPropagation();

  if (emojiMenu) {
    emojiMenu.remove();
    emojiMenu = null;
    return;
  }

  emojiMenu = document.createElement("div");
  emojiMenu.className = "emoji-menu";

  const emojis = ["😊", "😂", "😍", "😢", "👍", "❤️", "🔥", "🤔", "🥳"];
  emojis.forEach((emoji) => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.onclick = (event) => {
      event.stopPropagation();
      document.getElementById("message-input").value += emoji;
    };
    emojiMenu.appendChild(span);
  });

  document.body.appendChild(emojiMenu);
  const rect = e.target.getBoundingClientRect();
  emojiMenu.style.position = "absolute";
  emojiMenu.style.top = `${rect.top - 50}px`;
  emojiMenu.style.left = `${rect.left}px`;
});
document.addEventListener("click", () => {
  if (emojiMenu) {
    emojiMenu.remove();
    emojiMenu = null;
  }
});

// Dropdown menu toggle
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("message-dot")) {
    document.querySelectorAll(".message-dropdown").forEach(d => d.style.display = "none");
    const dropdown = e.target.nextElementSibling;
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  } else if (!e.target.closest(".message-dropdown")) {
    document.querySelectorAll(".message-dropdown").forEach(drop => {
      drop.style.display = "none";
    });
  }
});
