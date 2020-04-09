const socket = io();
const form = document.querySelector("#chat");
const addUsername = document.querySelector("#addUsername");
const username = document.querySelector("#username");
const message = document.querySelector(".messages");

//add username
addUsername.addEventListener("submit", function (e) {
  e.preventDefault();
  socket.emit("newuser", username.value);
  addUsername.parentNode.removeChild(addUsername);
});

// get message value
form.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log(m.value)

  if (m.value.includes("!villager")) {
    let villager = m.value.replace(/!villager /g, '');

    console.log(villager)
    socket.emit("fetch villager", message);
  } else {
    socket.emit("chat message", m.value);
  }
  m.value = "";
  return false;
});

//show message
socket.on("chat message", function (msg) {
  const newMessage = document.createElement("li");

  newMessage.textContent = msg;
  message.appendChild(newMessage);
});

//show server message
socket.on("server message", function (serverMsg) {
  const newServerMessage = document.createElement("li");
  newServerMessage.textContent = serverMsg;
  message.appendChild(newServerMessage);
});

//show command message
socket.on("command message", function (command) {
  const commandMessage = document.createElement("li");
  commandMessage.textContent = command;
  message.appendChild(commandMessage);
});

//show command message
socket.on("tweet", function (tweet) {
  console.log(tweet)
  console.log('hij doet t')
});