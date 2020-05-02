const socket = io();
const addBtn = document.querySelector("#add");
const addIsland = document.querySelector("#addIsland");
const feed = document.getElementById("feed");
const dailyMessage = document.getElementById("dailyMessage");

addBtn.addEventListener("click", function (e) {
  console.log("click!");
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
  socket.emit("get data", data);
});

socket.on("test", function (data) {
  console.log(data);
  let html = `
                <div class='daily'>
                <p>${data}</p>
                <li>${data.events}</li>
                <img src="${data.villager_images}" alt="Girl in a jacket">
                </div>`;
  dailyMessage.insertAdjacentHTML("afterbegin", html);
});

socket.on("turnip message", function (data) {
  console.log(data);
  let html = `
                <div class='card'>
                <li>Island : ${data.islandName}</li>
                <li>Date: ${data.time}</li>
                <li>Turnip price: ${data.turnipPrice}</li>
                </div>`;
  feed.insertAdjacentHTML("afterbegin", html);
});

socket.on("turnip board", function (data) {
  console.log(data);

  feed.innerHTML = "";

  data.forEach(function (data) {
    let html = `
                <div class='card'>
                <li>Island: ${data.islandName}</li>
                <li>Date: ${data.time}</li>
                <li>Turnip price: ${data.turnipPrice}</li>
                </div>`;
    feed.insertAdjacentHTML("beforeend", html);
  });
});
