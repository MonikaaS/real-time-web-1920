const socket = io();
const tweets = document.getElementById('tweets')

socket.on('tweet', function (data) {
    console.log(data.text)

    const newTweet = document.createElement("li");
    newTweet.textContent = data.text;

    tweets.appendChild(newTweet);
})