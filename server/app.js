import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';

import {
    indexRouter,
    usersRouter,
    authRouter,
    remembranceRouter,
} from './routes';
import { passportConfiguration, JWTConfiguration } from './services';
import { loginRequired } from './middlewares';

const app = express();
const __dirname = path.resolve();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport related - initialize and configs
app.use(passport.initialize()); // passport 사용 시작
passportConfiguration(); // passport.use 로 local strategy 사용
JWTConfiguration();

// routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', loginRequired, authRouter);
app.use('/api/remembrances', remembranceRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export { app };
