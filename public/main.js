const socket = io();
const tweets = document.getElementById('tweets')

socket.on('tweet', function (data) {
    console.log(data.text)
    console.log(data.lang)

    const newTweet = document.createElement("li");
    newTweet.textContent = data.text + ' ' + data.lang;

    tweets.appendChild(newTweet);
})