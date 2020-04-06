const express = require("express")
const app = express()
const Twit = require("twit")
const http = require("http").Server(app)
const io = require("socket.io")(http)
const bodyParser = require("body-parser")
require("dotenv").config()

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.static("public"))
app.set("view engine", "ejs")

const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
})

app.get("/", function (req, res) {
    res.render("pages/index", {});
})

io.sockets.on('connection', function (socket) {
    console.log('connected');

    let stream = T.stream('statuses/filter', {
        track: 'bored'
    })

    stream.on('tweet', function (tweet) {
        socket.emit('tweet', tweet);
    })
})

http.listen(process.env.PORT || 3000);