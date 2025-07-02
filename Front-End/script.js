//progress bar
function startProgressAndNavigate(url) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";
  progressBar.style.display = "block";

  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 50);

  setTimeout(() => {
    window.location.href = url;
  }, 500);
}
// Simulated credentials (in real app, check from DB)
const users = [
  { username: "admin", password: "admin123" },
  { username: "test", password: "test123" }
];

// Called from index.html
function handleLogin() {
  const uname = document.getElementById("login-username").value;
  const pwd = document.getElementById("login-password").value;
  const errorBox = document.getElementById("login-error");

  const matched = users.find(u => u.username === uname && u.password === pwd);

  if (matched) {
    // Store user data locally
    localStorage.setItem("chat-user", JSON.stringify(matched));
    // Redirect to chat page
    window.location.href = "chat.html";
  } else {
    errorBox.innerText = "Invalid username or password";
  }
}

// Called from chat.html
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("chat-user"));
  if (window.location.pathname.includes("chat.html")) {
    if (!user) {
      window.location.href = "index.html"; // redirect to login
    } else {
      document.getElementById("user-display").innerText = user.username;
    }
  }
};

function sendMessage() {
  const messageInput = document.getElementById("message");
  const msgBox = document.getElementById("messages");

  if (messageInput.value.trim() !== "") {
    const msg = document.createElement("div");
    msg.className = "message right";
    msg.innerText = messageInput.value;
    msgBox.appendChild(msg);
    messageInput.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
  }
}
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("login-password");
  const toggleIcon = document.getElementById("toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}
//forget link
function forgotPassword() {
  alert("🔐 Password recovery feature coming soon!");
}

//signup page 
function togglePassword(fieldId, icon) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    field.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

function handleSignup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const errorBox = document.getElementById("signup-error");

  errorBox.textContent = "";

  if (password !== confirm) {
    errorBox.textContent = "❌ Passwords do not match.";
    return;
  }

  if (password.length < 6) {
    errorBox.textContent = "❌ Password must be at least 6 characters.";
    return;
  }

  alert(`Account created for ${username}!\n(Backend coming soon)`);
  // TODO: Send to backend or Firebase
}



