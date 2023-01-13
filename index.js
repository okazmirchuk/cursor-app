const {EVENTS} = require("./src/constants");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

const controllers = require('./src/controllers')
const asyncEvents = require('./src/events')
const swaggerUi = require("swagger-ui-express");

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

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(require('./api-doc'))
);

app.use(express.static('./web/build'))

controllers(app)

io.on(EVENTS.CONNECTION, (socket) => {
    asyncEvents(socket)
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
