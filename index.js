const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
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

io.sockets.on("connection", function (socket) {
  console.log("someone connected");

  socket.emit("test", "joe joe");

  // fetch("https://nookipedia.com/api/today/?api_key=" + KEY)
  //   .then((res) => res.json())
  //   .then((data) => socket.emit("test", data))
  //   .catch((error) => console.error("Error:", error));

  socket.on("get data", function (data) {
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

  socket.on("disconnect", function () {
    console.log("someone disconnected");
  });
});

function getFormData(combined) {
  history.unshift(combined);
}

http.listen(process.env.PORT || 3000);
