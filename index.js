const {EVENTS} = require("./src/constants");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const path = require('path');

const controllers = require('./src/controllers')
const asyncEvents = require('./src/events')

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

app.use(express.static('./web/build'))

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

controllers(app)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/build/index.html'));
});

io.on(EVENTS.CONNECTION, (socket) => {
    asyncEvents(socket)
});
