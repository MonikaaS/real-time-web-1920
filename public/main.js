const socket = io();

const tweets = document.getElementById('tweets')

socket.on('tweet', function (data) {
    console.log(data)
})