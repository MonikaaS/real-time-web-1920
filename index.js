const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const ioClient = require("socket.io-client");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

const KEY = process.env.KEY;

app.get("/", function (req, res) {
  res.render("pages/index", {});
});

let history = [];
let subscribedRooms = [];

// event only occurs every 24hours
// const dailyMessage = ioClient(
//   "https://nookipedia.com/api/today/?api_key=" + KEY
// );

io.sockets.on("connection", function (socket) {
  console.log("someone connected");

  //users can subscribe on turnips above certain value
  socket.on("subscribe data", function (value) {
    socket.join(value)
    pushRoom(value)
  })

  //get daily message on connect
  fetch("https://nookipedia.com/api/today/?api_key=" + KEY)
    .then((res) => res.json())
    .then((data) => socket.emit("daily message", data))
    .catch((error) => console.error("Error:", error));

  //add new turnip message
  socket.on("add data", function (data) {
    fetch(
        "https://nookipedia.com/api/villager/" +
        data.villager +
        "/?api_key=" +
        KEY
      )
      .then((res) => res.json())
      .then(function (data) {
        let cleanedData = {
          villagerImage: data.image,
        };
        let getApiData = combineData(cleanedData);
      });

    //combine api data & form data
    function combineData(getApiData) {
      let formData = data;
      let apiData = getApiData;
      let combined = Object.assign(formData, apiData);
      getFormData(combined);

      //show new turnip message
      io.emit("turnip message", combined);

      subscribedRooms.forEach(function (value) {
        //if a user is subscribed to a turnip value, send them the message above value
        socket.to(value).emit('turnip subscription', {
          value: value,
          data
        })
      })
    }
  })

  // show old messages
  socket.emit("turnip board", history);

  //island room with dodocode [creator gets joined immediately]
  socket.on("dodocode room", function (data) {
    let room = data.dodoCode + "showcode";
    socket.join(room);

    io.sockets.in(room).emit("dodocode room", data);
  });

  // users first join the waiting room for an island
  socket.on("join waiting room", function (data) {
    let room = data.dodoCode;
    socket.join(room);
    io.sockets.in(room).emit("waiting room", data);

    let clients = [];
    for (var i in io.sockets.adapter.rooms[data.dodoCode].sockets) {
      clients.push(io.sockets.adapter.nsp.connected[i]);
    }

    // if there is less then 3 people in the island room, first user in array leaves waiting room and joins island room
    if (io.sockets.adapter.rooms[room + "showcode"] != undefined) {
      if (io.sockets.adapter.rooms[room + "showcode"].length < 3) {
        clients[0].leave(data.dodoCode);
        clients[0].join(data.dodoCode + "showcode");

        io.sockets.in(room + "showcode").emit("dodocode room", data);
      }
    }
  });

  socket.on("leave room", function (data) {
    socket.leave(data.dodoCode);
    socket.leave(data.dodoCode + "showcode");

    // if there is less then 3 people in the island room, first user in array leaves waiting room and joins island room
    if (io.sockets.adapter.rooms[data.dodoCode] != undefined) {
      let clients = [];
      for (var i in io.sockets.adapter.rooms[data.dodoCode].sockets) {
        clients.push(io.sockets.adapter.nsp.connected[i]);
      }

      if (io.sockets.adapter.rooms[data.dodoCode + "showcode"] != undefined) {
        if (io.sockets.adapter.rooms[data.dodoCode + "showcode"].length < 3) {
          clients[0].leave(data.dodoCode);
          clients[0].join(data.dodoCode + "showcode");

          io.sockets.in(data.dodoCode + "showcode").emit("dodocode room", data);
        }
      }
    }
  });

  socket.on("disconnect", function () {
    console.log("someone disconnected");
  });
});

//push combined data in array
function getFormData(combined) {
  history.unshift(combined);
}

//push subscribed room in to array
function pushRoom(value) {
  if (!subscribedRooms.includes(value)) {
    subscribedRooms.push(value)
  }
}


http.listen(process.env.PORT || 3000);