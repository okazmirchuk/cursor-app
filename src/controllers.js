const {getAll, findOneById} = require("./services");

module.exports = (app) => {
    app.get('/users', (req, res) => {
        res.send({
            data: getAll(),
            count: getAll().length,
        })
    })

    app.get('/users/:id', (req, res) => {
        const {id} = req.params

        res.send({data: findOneById(id)})
    })
}
