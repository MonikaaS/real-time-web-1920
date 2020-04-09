const socket = io();
const form = document.querySelector("#chat");
const addUsername = document.querySelector("#addUsername");
const username = document.querySelector("#username");
const message = document.querySelector(".messages");
const turnipList = document.querySelector(".turnipList");

//add username
addUsername.addEventListener("submit", function (e) {
  e.preventDefault();
  socket.emit("newuser", username.value);
  addUsername.parentNode.removeChild(addUsername);
});

// get message value
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (m.value.includes("!turnips")) {
    let value = m.value.replace(/!turnips /g, '');

    socket.emit("turnip board", value);
  } else if (m.value.includes("!random")) {
    socket.emit("fetch advice", m.value);
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
  newServerMessage.classList.add("serverMessage");
  message.appendChild(newServerMessage);
});

//show command message
socket.on("command message", function (command) {
  console.log(command)

  const commandMessage = document.createElement("li");
  commandMessage.textContent = command;
  commandMessage.classList.add("commandMessage");
  message.appendChild(commandMessage);
});

//show turnip board
socket.on("turnip board", function (turnipValue) {

  const userTurnips = document.createElement("li");
  userTurnips.textContent = turnipValue;
  turnipList.appendChild(userTurnips);
});