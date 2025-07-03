// Dummy friend data (you will fetch this from backend later)
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

  // ✅ Auto-close sidebar & overlay on mobile
  if (window.innerWidth <= 768) {
    document.querySelector(".sidebar").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
  }
}
// Send message
function sendMessage() {
  const input = document.getElementById("message-input"); // ✅ Define input
  const message = input.value.trim();
  if (!message || !selectedFriend) return;

  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const msgWrapper = document.createElement("div");
  msgWrapper.className = "message message-right";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerHTML = `
    <span class="msg-text">${message}</span>
    <span class="msg-time">${time}</span>
  `;

  const dotsMenu = document.createElement("div");
  dotsMenu.className = "msg-dots";
  dotsMenu.innerHTML = `
    <div class="dots-icon">⋮</div>
    <div class="msg-options">
      <div class="edit-option">Edit</div>
      <div class="delete-option">Delete</div>
    </div>
  `;

  msgWrapper.appendChild(dotsMenu);
  msgWrapper.appendChild(bubble);
  document.getElementById("chat-body").appendChild(msgWrapper);

  // Action buttons
  dotsMenu.querySelector(".edit-option").onclick = () => {
    input.value = message;
    msgWrapper.remove();
  };
  dotsMenu.querySelector(".delete-option").onclick = () => {
    msgWrapper.remove();
  };

  input.value = "";        // ✅ Clear input
  input.focus();           // ✅ Keep keyboard open on mobile
  document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;
}

  // Scroll to bottom
  document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;

  // Simulate reply after 1 sec
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "message message-left";
    reply.innerHTML = `<p>Reply from ${selectedFriend}<span class="msg-time">${time}</span></p>`;
    document.getElementById("chat-body").appendChild(reply);
  }, 1000);

//humberger
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");
const toggleBtn = document.getElementById("menu-toggle");

// Open sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");
});

// Close on overlay click
overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
});

// Also close when clicking outside (optional extra safety)
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
// To Add Enter and Shift 
document.getElementById("message-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent line break
    sendMessage();      // call the function to send message
  }
});
//add emoji
let emojiMenu;

document.getElementById("emoji-btn").addEventListener("click", (e) => {
  e.stopPropagation(); // stop it from closing instantly

  // Toggle off if already open
  if (emojiMenu) {
    emojiMenu.remove();
    emojiMenu = null;
    return;
  }

  // Create emoji menu
  emojiMenu = document.createElement("div");
  emojiMenu.className = "emoji-menu";

  const emojis = ["😊", "😂", "😍", "😢", "👍", "❤️", "🔥", "🤔", "🥳"];
  emojis.forEach((emoji) => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.onclick = (event) => {
      event.stopPropagation(); // don't let it close
      document.getElementById("message-input").value += emoji;
      // ❌ REMOVE this line (no auto-close now)
      // emojiMenu.remove();
      // emojiMenu = null;
    };
    emojiMenu.appendChild(span);
  });

  document.body.appendChild(emojiMenu);
  const rect = e.target.getBoundingClientRect();
  emojiMenu.style.position = "absolute";
  emojiMenu.style.top = `${rect.top - 50}px`; // above
  emojiMenu.style.left = `${rect.left}px`;
});

//Close only when clicking outside
document.addEventListener("click", () => {
  if (emojiMenu) {
    emojiMenu.remove();
    emojiMenu = null;
  }
});

