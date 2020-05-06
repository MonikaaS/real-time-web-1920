const socket = io();
const addBtn = document.querySelector("#add");
const addIsland = document.querySelector("#addIsland");
const feed = document.getElementById("feed");
const subscribedFeed = document.getElementById("subscribedFeed");
const dailyMessage = document.getElementById("dailyMessage");
const daily = document.querySelector(".daily");
const waitingroom = document.querySelector(".waitingroom");
const dodoCodeShow = document.querySelector(".dodoCodeShow");
const submitBtn = document.querySelector(".submitBtn");
const subscribeBtn = document.querySelector(".subscribeBtn");
const leaveBtn = document.querySelector(".leaveBtn");

addBtn.addEventListener("click", function (e) {
  document.querySelector(".form").classList.toggle("visible");
});

subscribeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let value = document.querySelector("#turnipAmount").value

  feed.style.display = "none"

  document.querySelector('.show').style.display = "block"
  subscribedFeed.style.display = "flex"
  subscribedFeed.style.justifyContent = "start"
  subscribedFeed.style.flexWrap = "wrap"

  console.log('yo')
  document.querySelector('.roomName').textContent = 'showing only turnips above: ' + value

  socket.emit("subscribe data", value)
});

//add Island info
addIsland.addEventListener("submit", function (e) {
  e.preventDefault();

  let data = {
    islandName: document.querySelector("#IslandName").value,
    turnipPrice: document.querySelector("#TurnipPrice").value,
    fruitType: document.querySelector('input[name=fruit]:checked').value,
    hemisphere: document.querySelector('input[name=hemisphere]:checked').value,
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

//show daily message
socket.on("daily message", function (data) {
  console.log(data);
  let villagerimage = data.villager_images;

  document.querySelector("#dailySpan").innerHTML = data.message
  document.querySelector("#dailyEvent").innerHTML = data.events

  villagerimage.forEach(function (data) {
    image = document.createElement("img");
    image.src = data.toString();
    dailyMessage.appendChild(image);
  });
});

//show new message
socket.on("turnip message", function (data) {
  let html = `
                <div class='card'>
                <div>
                <h2 class="title">${data.islandName}</h2>
                <span>Date: ${data.time}</span>
                <img class="icon" src="${data.hemisphere}.png" alt="${data.hemisphere}">
                <img class="icon" src="${data.fruitType}.png" alt="${data.fruitType}">
                <li class="inline"><img class="icon" src="Turnip_NH_Inv_Icon.png" alt="${data.turnipPrice}"> ${data.turnipPrice} bells</li>
                <button value="${data.dodoCode}" name="${data.islandName}" class="joinBtn">join room</button>
                </div>
                <img class="cardImg" src="${data.villagerImage}" alt="">
                </div>
                `;
  feed.insertAdjacentHTML("afterbegin", html);
});

//show only subscribed messages
socket.on('turnip subscription', function (data) {
  if (data.value < data.data.turnipPrice) {
    feed.style.display = "none"

    document.querySelector('.roomName').textContent = 'showing only turnips above: ' + data.value
    let html = `
    <div class='card'>
    <div>
    <h2 class="title">${data.data.islandName}</h2>
    <span>Date: ${data.data.time}</span>
    <img class="icon" src="${data.data.hemisphere}.png" alt="${data.data.hemisphere}">
    <img class="icon" src="${data.data.fruitType}.png" alt="${data.data.fruitType}">
    <li class="inline"><img class="icon" src="Turnip_NH_Inv_Icon.png" alt="${data.turnipPrice}"> ${data.turnipPrice} bells</li>
    <button value="${data.data.dodoCode}" name="${data.data.islandName}" class="joinBtn">join room</button>
    </div>
    <img class="cardImg" src="${data.data.villagerImage}" alt="">
    </div>
                 `;
    subscribedFeed.insertAdjacentHTML("afterbegin", html);
  }
});

//show old messages
socket.on("turnip board", function (data) {
  feed.innerHTML = "";

  data.forEach(function (data) {
    let html = `
    <div class='card'>
    <div>
    <h2 class="title">${data.islandName}</h2>
    <span>Date: ${data.time}</span>
    <img class="icon" src="${data.hemisphere}.png" alt="${data.hemisphere}">
    <img class="icon" src="${data.fruitType}.png" alt="${data.fruitType}">
    <li class="inline"><img class="icon" src="Turnip_NH_Inv_Icon.png" alt="${data.turnipPrice}"> ${data.turnipPrice} bells</li>
    <button value="${data.dodoCode}" name="${data.islandName}" class="joinBtn">join room</button>
    </div>
    <img class="cardImg" src="${data.villagerImage}" alt="">
    </div>`;
    feed.insertAdjacentHTML("beforeend", html);
  });
});

//add dynamic rooms to created messages
document.querySelector("body").addEventListener("click", function (event) {
  if (event.target.className === "joinBtn") {

    socket.emit("join waiting room", {
      dodoCode: event.target.value,
      name: event.target.name,
    });
  }
});

//dynamic waiting room
socket.on("waiting room", function (data) {
  waitingroom.style.display = "block";
  feed.style.display = "none"
  document.querySelector(".show").style.display = "none"
  dodoCodeShow.textContent = "Please wait";
  document.querySelector('.h2WaitingRoom').textContent = data.name + " waiting room";
  document.querySelector('.spanText').textContent = "You're currently in line for " + data.name;

  leaveBtn.addEventListener("click", function (event) {
    console.log('waiting room')
    event.preventDefault()
    socket.emit("leave room", data);
  });
});

//dynamic island room
socket.on("dodocode room", function (data) {
  waitingroom.style.display = "block";
  feed.style.display = "none"
  dodoCodeShow.textContent = "Room name: " + data.name;
  document.querySelector('.h2WaitingRoom').textContent = "dodo code: " + data.dodoCode;
  document.querySelector('.spanText').textContent = "please leave the room when you're done";
});