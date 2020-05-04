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

const dailyMessage = ioClient(
  "https://nookipedia.com/api/today/?api_key=" + KEY
);

// console.log(
//   dailyMessage.on("event occured", function (event) {
//     console.log(event);
//   })
// );

io.sockets.on("connection", function (socket) {
  console.log("someone connected");
  //socket.emit("test", "joe joe");

  fetch("https://nookipedia.com/api/today/?api_key=" + KEY)
    .then((res) => res.json())
    .then((data) => socket.emit("test", data))
    .catch((error) => console.error("Error:", error));

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

    function combineData(getApiData) {
      let formData = data;
      let apiData = getApiData;
      let combined = Object.assign(formData, apiData);
      getFormData(combined);
      io.emit("turnip message", combined);
    }
  });

  socket.emit("turnip board", history);

  socket.on("dodocode room", function (data) {
    let room = data.dodoCode + "showcode";
    socket.join(room);
    io.sockets.in(room).emit("dodocode room", data);
  });

  socket.on("join waiting room", function (data) {
    let room = data.dodoCode;
    socket.join(room);
    io.sockets.in(room).emit("waiting room", data);

    let clients = [];
    for (var i in io.sockets.adapter.rooms[data.dodoCode].sockets) {
      clients.push(io.sockets.adapter.nsp.connected[i]);
    }

    if (io.sockets.adapter.rooms[room + "showcode"].length < 3) {
      clients[0].leave(data.dodoCode);
      clients[0].join(data.dodoCode + "showcode");

      io.sockets.in(room + "showcode").emit("dodocode room", data);
    }
  });

  socket.on("leave room", function (data) {
    socket.leave(data.dodoCode + "showcode");

    if (io.sockets.adapter.rooms[data.dodoCode] != undefined) {
      let clients = [];
      for (var i in io.sockets.adapter.rooms[data.dodoCode].sockets) {
        clients.push(io.sockets.adapter.nsp.connected[i]);
      }

      if (io.sockets.adapter.rooms[data.dodoCode + "showcode"].length < 3) {
        clients[0].leave(data.dodoCode);
        clients[0].join(data.dodoCode + "showcode");

        io.sockets.in(data.dodoCode + "showcode").emit("dodocode room", data);
      }
    }
  });

  socket.on("disconnect", function () {
    console.log("someone disconnected");
  });
});

function getFormData(combined) {
  history.unshift(combined);
}

http.listen(process.env.PORT || 3000);
