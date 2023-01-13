const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cursor sharing application',
            version: '1.0.0',
        },
    },
    apis: ['./src/*.js'], // files containing annotations as above
};

module.exports = swaggerJsdoc(options);
