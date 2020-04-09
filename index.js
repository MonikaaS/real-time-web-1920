const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
require("dotenv").config();

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

  //fetch the data when a user uses a command
  socket.on("fetch villager", function () {
    io.emit("command message", `er is een command gebruikt`);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(process.env.PORT || 3000);