import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import { usersRouter, authRouter } from './routes';
import {
    passportConfiguration,
    JWTConfiguration,
} from './services/passport-service';
import { loginRequired } from './middlewares/login-required';

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

//passport related - initialize and configs
app.use(passport.initialize()); // passport 사용 시작
passportConfiguration(); // passport.use 로 local strategy 사용
JWTConfiguration();

//routers
app.use('/api/users', usersRouter);
app.use('/api/auth', loginRequired, authRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export { app };
