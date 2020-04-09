const express = require("express");
const app = express();
const http = require("http").Server(app);
const Twit = require("twit");
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index", {});
});

io.sockets.on("connection", function (socket) {
  console.log("A user connected");

  //add username
  socket.on("newuser", function (username) {
    socket.username = username;
    io.sockets.emit("newName", username);

    //send welcome message
    socket.emit(
      "server message",
      `SERVER: Welcome ${username} !!!`
    );

    // Show everyone else who has joined
    socket.broadcast.emit('server message', `SERVER: User ${username} connected.`);
  });

  //send message
  socket.on("chat message", function (msg) {
    io.emit("chat message", socket.username + ": " + msg);
  });

  //fetch advice data when a user uses !random command
  socket.on("fetch advice", function (value) {
    T.get(
      "statuses/user_timeline", {
        screen_name: "animalcrossing",
        include_rts: false,
        count: 20
      },
      function (err, data, response) {
        const advice = data[Math.floor(Math.random() * data.length)];
        io.emit("command message", advice.text);
      }
    );

    io.emit("command message", `er is een command gebruikt`);
  });

  //send turnip to board
  socket.on("turnip board", function (value) {
    io.emit("turnip board", socket.username + " " + value);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(process.env.PORT || 3000);