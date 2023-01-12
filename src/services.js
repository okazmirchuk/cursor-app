let users = []

const updateUserCoordinates = ({socketId, x, y}) => {
    users = users.map(user => {
        if (user.userId === socketId) {
            return {
                ...user,
                x, y
            }
        }

        return user
    })

    return users
}

const addUser = (user) => {
    users = [...users, user]
}

const removeUserById = (socketId) => {
    users = users.filter(user => user.userId !== socketId)
}

const findOneById = (socketId) => {
    return users.find(user => user.userId === socketId)
}

const getAll = () => users

module.exports = {
    updateUserCoordinates,
    addUser,
    removeUserById,
    findOneById,
    getAll,
}
