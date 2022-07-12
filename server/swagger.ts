import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Put Your API Name',
            version: '1.0.0',
            description: 'Example docs',
        },
        servers: [
            {
                url: `http://localhost:5000`, //env
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const specs = swaggerJSDoc(options);

export { specs }