const socket = io();
const addBtn = document.querySelector("#add");
const addIsland = document.querySelector("#addIsland");
const feed = document.getElementById("feed");
const dailyMessage = document.getElementById("dailyMessage");
const daily = document.querySelector(".daily");
const waitingroom = document.querySelector(".waitingroom");
const dodoCodeShow = document.querySelector(".dodoCodeShow");

addBtn.addEventListener("click", function (e) {
  document.querySelector(".form").classList.toggle("visible");
});

//add Island info
addIsland.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = {
    islandName: document.querySelector("#IslandName").value,
    turnipPrice: document.querySelector("#TurnipPrice").value,
    fruitType: document.querySelector("#fruit").value,
    villager: document.querySelector("#villager").value,
    dodoCode: document.querySelector("#dodoCode").value,
    time: new Date().toLocaleString(),
  };

  document.querySelector(".form").classList.toggle("visible");
  socket.emit("add data", data);

  socket.emit("dodocode room", {
    dodoCode: data.dodoCode,
    name: data.islandName,
  });
});

const joinBtn = document.querySelectorAll(".joinBtn");

socket.on("test", function (data) {
  console.log(data);
  let villagerimage = data.villager_images;
  //let image;

  let html = `<h2>Today's Message:</h2>
                <p>${data.message}</p>
                <li>${data.events}</li>`;
  dailyMessage.insertAdjacentHTML("afterbegin", html);

  villagerimage.forEach(function (data) {
    image = document.createElement("img");
    image.src = data.toString();
    console.log(image.src);
    dailyMessage.appendChild(image);
  });
});

socket.on("turnip message", function (data) {
  let html = `
                <div class='card'>
                <div>
                <li>Island : ${data.islandName}</li>
                <li>Date: ${data.time}</li>
                <li>Turnip price: ${data.turnipPrice}</li>
                </div>
                <img class="cardImg" src="${data.villagerImage}" alt="Girl in a jacket">
                <button value="${data.dodoCode}" name="${data.islandName}" class="joinBtn">join room"</button>
                </div>
                `;
  feed.insertAdjacentHTML("afterbegin", html);
});

socket.on("turnip board", function (data) {
  feed.innerHTML = "";

  console.log(data);

  data.forEach(function (data) {
    let html = `
                <div class='card'>
                <div>
                <li>Island: ${data.islandName}</li>
                <li>Date: ${data.time}</li>
                <li>Turnip price: ${data.turnipPrice}</li>
                </div>
                <img class="cardImg" src="${data.villagerImage}" alt="Girl in a jacket">
                <button value="${data.dodoCode}" name="${data.islandName}" class="joinBtn">join room</button>
                </div>`;
    feed.insertAdjacentHTML("beforeend", html);
  });
});

document.querySelector("body").addEventListener("click", function (event) {
  if (event.target.className === "joinBtn") {
    console.log(event.target);

    socket.emit("join waiting room", {
      dodoCode: event.target.value,
      name: event.target.name,
    });
  }
});

socket.on("waiting room", function (data) {
  const h1 = document.createElement("h1");
  waitingroom.style.display = "block";
  dodoCodeShow.textContent = "Please wait";
  h1.textContent = data.name + " waiting room";
});

socket.on("dodocode room", function (data) {
  const h1 = document.createElement("h1");
  waitingroom.style.display = "block";
  dodoCodeShow.textContent = data.dodoCode;
  h1.textContent = data.name;
});
