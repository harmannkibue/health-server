const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4000;
const index = require("./route/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
    clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 10000);
    socket.on("disconnect", () => {
    console.log("Client disconnected");
    });
   });

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get (
            "https://api.thingspeak.com/channels/913414/feeds.json?api_key=9W82URME4TT8Z99J&results=2"
        );
        socket.emit("Data", res.data.feeds[1]);
        console.log(res.data.feeds[1]);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

server.listen(port, () => console.log(`Port ${port} is active...`));