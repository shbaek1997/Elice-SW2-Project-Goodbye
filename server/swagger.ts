import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        info: {
            title: 'Project Good-Bye',
            version: '1.0.0',
            description: '온라인 유언장 서비스 API Docs',
        },
        servers: [
            {
                url: `http://localhost:5000`, //env
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/app.ts', './src/swagger/*'],
};
const specs = swaggerJSDoc(options);

export { specs };
