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
  console.log("connected");
});

http.listen(process.env.PORT || 3000);
