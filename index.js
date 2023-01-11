const express = require('express')
const http = require('http');
const { Server } = require("socket.io");

const app = express()
const port = 4000

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]

    }
});

app.get('/', (req, res) => {
    res.send('')
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

io.on('connection', (socket) => {
    socket.join("SHARED_SPACE");

    socket.on("MOVE_CURSOR", ({x, y, userId}) => {
        io.to('shared-space').emit('UPDATE_CURSOR_COORDINATES', {x, y, userId})
    });
});

