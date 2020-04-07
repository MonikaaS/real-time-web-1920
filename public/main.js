const socket = io();
var form = document.querySelector("#chat");
const addUsername = document.querySelector("#addUsername");
const message = document.querySelector(".messages");

//add username
addUsername.addEventListener("submit", (e) => {
  const username = document.querySelector("#username");
  e.preventDefault();
  socket.emit("newuser", username.value);
  console.log(username.value);
  addUsername.parentNode.removeChild(addUsername);
});

// get message value
form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("chat message", m.value);
  m.value = "";
  return false;
});

//show message
socket.on("chat message", function (msg) {
  const newMessage = document.createElement("li");
  newMessage.textContent = msg;
  message.appendChild(newMessage);
});

// socket.on("newName", function (id, name) {
//   console.log(id);
// });
