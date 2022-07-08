import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { userService } from '../services/user-service';
const usersRouter = Router();

/* GET users listing. */
usersRouter.post('/register', async (req, res, next) => {
    try {
        //is 를 사용해서 body를 확인해 줄까?
        const { fullName, email, password, repeatPassword, dateOfBirth } =
            req.body;

        const newUser = await userService.addUser({
            fullName,
            email,
            password,
            repeatPassword,
            dateOfBirth,
        });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/login', async (req, res, next) => {
    try {
        //is 로 req body 확인?
        passport.authenticate(
            'local',
            { session: false },
            (error, user, info) => {
                // 성공적으로 유저가 있어야 유저 객체가 생기고,
                //유저 인증 실패시 유저는 자동으로 false;
                if (error || !user) {
                    //인증 성공을 해야 유저 객체가 생겨서 JOI로 검증하기 어려움...
                    // passport 인증 실패 or 유저가 없으면 error
                    res.status(400).json({
                        result: 'error',
                        reason: info.message,
                    });
                    return; // throw로 여러개를 시도해 보았는데, throw로는 에러 해결이 잘 안됨.
                }
                req.login(user, { session: false }, (loginError) => {
                    // login을 하면
                    if (loginError) {
                        res.status(400).send(loginError);
                        return;
                    }
                    const secretKey =
                        process.env.JWT_SECRET_KEY || 'secret-key'; // login 성공시 key값을 써서 토큰 생성
                    const token = jwt.sign({ userId: user._id }, secretKey, {
                        expiresIn: '7d',
                    });
                    res.status(200).json({
                        token,
                        userId: user._id,
                    });
                });
            },
        )(req, res); // 이 부분은 수업 때나 지금이나 이해가 잘 안되지만 필요함.
    } catch (error) {
        next(error);
    }
});

export { usersRouter };
