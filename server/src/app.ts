import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';

import {
    indexRouter,
    usersRouter,
    authRouter,
    remembranceRouter,
    obituaryRouter,
} from './routes';
import { passportConfiguration, JWTConfiguration } from './services';
import { loginRequired, errorHandler, notFoundHandler } from './middlewares';
// import { swaggerSpecs } from '../swagger';

const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.listen(PORT, () => {
    console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${PORT}`);
});

// cors error
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// passport related - initialize and configs
app.use(passport.initialize()); // passport 사용 시작
passportConfiguration(); // passport.use 로 local strategy 사용
JWTConfiguration();

// swagger
const swaggerYAML = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerYAML, { explorer: true }),
);

// routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', loginRequired, authRouter);
app.use('/api/remembrances', remembranceRouter);
app.use('/api/obituaries', obituaryRouter);

// 404 handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);
export { app };
