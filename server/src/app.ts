import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import {
    indexRouter,
    usersRouter,
    authRouter,
    remembranceRouter,
} from './routes';
import { passportConfiguration, JWTConfiguration } from './services';
import { loginRequired, errorHandler, notFoundHandler } from './middlewares';
import { swaggerSpecs } from '../swagger';

const app = express();

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
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, { explorer: true }),
);

// routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', loginRequired, authRouter);
app.use('/api/remembrances', remembranceRouter);

// 404 handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);
export { app };
