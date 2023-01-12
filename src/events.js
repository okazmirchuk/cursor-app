const {EVENTS, SPACE_NAME} = require("./constants");
const {updateUserCoordinates, addUser, removeUserById, findOneById} = require("./services");

module.exports = (socket) => {
    socket.join(SPACE_NAME);

    socket.on(EVENTS.MOVE_CURSOR, ({x, y}) => {
        socket.to(SPACE_NAME).emit(EVENTS.UPDATE_CURSOR_COORDINATES, {x, y, userId: socket.id})

        updateUserCoordinates({
            socketId: socket.id,
            x,
            y
        })
    });

    socket.on(EVENTS.USER_JOINED, ({userName, userColor}) => {
        socket.to(SPACE_NAME).emit(EVENTS.USER_JOINED, {userName, userId: socket.id, userColor});

        addUser({userName, userId: socket.id, userColor})
    });

    socket.on(EVENTS.DISCONNECT, () => {
        socket.to(SPACE_NAME).emit(EVENTS.USER_LEFT, {userId: socket.id, userName: findOneById(socket.id)?.userName});
        socket.leave(SPACE_NAME)

        removeUserById(socket.id)
    });
}
