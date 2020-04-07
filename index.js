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
    io.sockets.emit("newName", socket.id, socket.username);
  });

  //send message
  socket.on("chat message", function (msg) {
    let message = msg.split(" ");

    if (message.includes("!trump")) {
      T.get(
        "statuses/user_timeline",
        { screen_name: "potus", count: 200 },
        function (err, data, response) {
          console.log(data.length);
          io.emit("chat message", msg);

          const randomTweet = data[Math.floor(Math.random() * data.length)];
          io.emit("chat message", randomTweet.text);
        }
      );
    } else {
      io.emit("chat message", socket.username + ": " + msg);
    }
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(process.env.PORT || 3000);
