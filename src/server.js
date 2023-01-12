const cors = require("cors");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

require('dotenv').config()

const app = express()
const port = process.env.PORT

const server = http.createServer(app);

const corsOptions = {
    // JUST FOR TESTING PURPOSES :)
    cors: {
        origin: "*",
        methods: '*'
    }
}

const io = new Server(server, corsOptions);

app.use(cors({
    origin: corsOptions.cors.origin,
    methods: corsOptions.cors.methods
}));

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = {
    io,
    app
}
