import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Project Good-Bye',
            version: '1.0.0',
            description: '온라인 유언장 서비스 API Docs',
        },
        servers: [
            {
                url: `http://localhost:${process.env.SERVER_PORT}`,
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/swagger/*'],
};

const specs = swaggerJSDoc(options);

export { specs };
