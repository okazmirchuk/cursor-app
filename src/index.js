const express = require('express')
const http = require('http');
const {Server} = require("socket.io");
const {SPACE_NAME} = require("./services");
const {EVENTS} = require("./constants");
const cors = require("cors");

require('dotenv').config()

const app = express()
const port = 4000

const server = http.createServer(app);

const corsOptions = {
    cors: {
        origin: "http://localhost:3006",
        methods: ["GET", "POST"]
    }
}

const io = new Server(server, corsOptions);

app.use(cors({
    origin: corsOptions.cors.origin,
    methods: corsOptions.cors.methods
}));

app.get('/', (req, res) => {
    res.send('')
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

let users = []

io.on(EVENTS.CONNECTION, (socket) => {
    socket.join(SPACE_NAME);

    socket.on(EVENTS.MOVE_CURSOR, ({x, y}) => {
        socket.to(SPACE_NAME).emit(EVENTS.UPDATE_CURSOR_COORDINATES, {x, y, userId: socket.id})
    });

    socket.on(EVENTS.USER_JOINED, ({userName, userColor}) => {
        socket.to(SPACE_NAME).emit(EVENTS.USER_JOINED, {userName, userId: socket.id, userColor});

        users.push({userName, userId: socket.id, userColor})

        console.log('joined: ', users, {userName, userId: socket.id, userColor});
    });

    socket.on(EVENTS.DISCONNECT, () => {
        socket.to(SPACE_NAME).emit(EVENTS.USER_LEFT, {userId: socket.id});
        socket.leave(SPACE_NAME)

        users = users.filter(user => user.userId !== socket.id)
    });
});

app.get('/users', (req, res) => {
    res.send({
        data: users
    })
})
