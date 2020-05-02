const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const bodyParser = require("body-parser")
require("dotenv").config()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"))
app.set("view engine", "ejs")

app.get("/", function (req, res) {
  res.render("pages/index", {})
})

let history = []
let rooms = []


io.sockets.on("connection", function (socket) {

  socket.emit('test', 'Cow goes moo');

  socket.on("turnip message", function (data) {
    io.emit("turnip message", data);
    storeData(data)
  });

  socket.on("today", function (data) {
    io.emit("today", data);
  });

  socket.emit("turnip board", history)

  socket.on("disconnect", function () {
    console.log("someone disconnected")
  })
})

function storeData(data) {
  history.unshift(data)
  console.log(history)
}

http.listen(process.env.PORT || 3000);