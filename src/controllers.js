const {getAll, findOneById} = require("./services");
const path = require("path");

module.exports = (app) => {
    /**
     * @openapi
     * /users:
     *   get:
     *     description: Fetch all users from the database!
     *     responses:
     *       200:
     *         description: Returns a users and count.
     */
    app.get('/users', (req, res) => {
        res.send({
            data: getAll(),
            count: getAll().length,
        })
    })

    /**
     * @openapi
     * /users{id}:
     *   get:
     *     description: Find one user by id!
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *         type: string
     *        required: true
     *        description: The user id
     *     responses:
     *       200:
     *         description: Returns a user.
     */
    app.get('/users/:id', (req, res) => {
        const {id} = req.params

        res.send({data: findOneById(id)})
    })

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/web/build/index.html'));
    });
}
