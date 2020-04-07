const socket = io();
const tweets = document.getElementById('tweets')

socket.on('chat', function (data) {
    console.log(data.text)
    console.log(data.lang)

    const newMessage = document.createElement("li");
    newMessage.textContent = data;

    tweets.appendChild(newTweet);
})