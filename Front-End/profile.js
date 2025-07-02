// Simulated data source (replace this with backend later)
const users = [
  {
    username: "Sahil",
    avatar: "https://i.pravatar.cc/150?img=11",
    bio: "Ethical hacker. Future coder. Real-time chat app builder.",
    isFriend: false
  },
  {
    username: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    bio: "I love React and chatting.",
    isFriend: true
  }
];

// Get username from URL
const urlParams = new URLSearchParams(window.location.search);
const profileUsername = urlParams.get("username");

// Load profile
const user = users.find(u => u.username.toLowerCase() === profileUsername?.toLowerCase());

if (user) {
  document.getElementById("profile-avatar").src = user.avatar;
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-bio").textContent = user.bio;

  const friendBtn = document.getElementById("friend-btn");
  if (user.isFriend) {
    friendBtn.textContent = "Message";
    friendBtn.onclick = () => {
      window.location.href = `chat.html?friend=${user.username}`;
    };
  } else {
    friendBtn.textContent = "Send Friend Request";
    friendBtn.onclick = () => {
      friendBtn.disabled = true;
      friendBtn.textContent = "Request Sent";
      // ✅ Later: call /api/friend-request
    };
  }
} else {
  document.body.innerHTML = "<h2 style='text-align:center'>User not found</h2>";
}
