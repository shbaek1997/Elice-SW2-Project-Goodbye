import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
    userService,
    remembranceService,
    willService,
    sendMailTest,
} from '../services';
import { registerJoiSchema } from '../db/schemas/joi-schemas';

const usersRouter = Router();

usersRouter.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?

            const { fullName, email, password, repeatPassword, dateOfBirth } =
                req.body;
            const isValid = await registerJoiSchema.validateAsync({
                fullName,
                email,
                password,
                repeatPassword,
                dateOfBirth,
            });

            const newUser = await userService.addUser({
                fullName,
                email,
                password,
                repeatPassword,
                dateOfBirth,
            });

            // 생성된 유저 정보로 추모 데이터 생성
            const userId = newUser._id.toString();
            const remembranceInfo = {
                userId,
                fullName,
                dateOfBirth,
            };
            remembranceService.addRemembrance(remembranceInfo);

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    },
);

usersRouter.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 로 req body 확인?
            passport.authenticate(
                'local',
                { session: false },
                (error, user, info) => {
                    // 성공적으로 유저가 있어야 유저 객체가 생기고,
                    // 유저 인증 실패시 유저는 자동으로 false;
                    if (error || !user) {
                        // 인증 성공을 해야 유저 객체가 생겨서 JOI로 검증하기 어려움...
                        // passport 인증 실패 or 유저가 없으면 error
                        next(info);
                        return;
                    }
                    req.login(user, { session: false }, async (loginError) => {
                        // login을 하면
                        if (loginError) {
                            res.status(400).send(loginError);
                            return;
                        }
                        const secretKey =
                            process.env.JWT_SECRET_KEY || 'secret-key'; // login 성공시 key값을 써서 토큰 생성
                        const token = jwt.sign(
                            { userId: user._id },
                            secretKey,
                            {
                                expiresIn: '7d',
                            },
                        );
                        // console.log(user);

                        res.status(200).json({
                            token,
                            userId: user._id,
                        });
                    });
                },
            )(req, res, next); // 이 부분은 수업 때나 지금이나 이해가 잘 안되지만 필요함.
        } catch (error) {
            next(error);
        }
    },
);

// 결국에는 한 유저의 유언장 목록을 전체 전송해야 할텐데, 이부분을 back에서 다 찾아서 전송하는 api가 맞을까, front가 client에서 여러번 요청을 하는게 나을까
usersRouter.post(
    '/sendEmail',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?
            const { receivers, subject, html } = req.body;
            sendMailTest(receivers, subject, html);
            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

// email로 온 유언장을 열람했을 경우, 해당 유저의 유언장 안의 수신자 목록의 이메일과 일치하는지 확인 후, 열람이 되게 하는 API
// 유언장 링크를 타고 열람을 하면, 모달 창 같은 방식으로 열람한 사람의 이메일 주소를 입력받게 함.
usersRouter.post(
    '/:willId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is 를 사용해서 body를 확인해 줄까?
            const { willId } = req.params;
            const { email } = req.body;
            const will = await willService.findWill(willId);
            // will 안의 receivers는 receiver Id가 등록되어 있고,
            const { receivers }: any = will;
            const matchedReceiver = receivers.find(
                (receiver) => receiver.email === email,
            );
            if (!matchedReceiver) {
                throw new Error('올바르지 않은 이메일 주소입니다.');
            }
            res.status(200).json({ will });
        } catch (error) {
            next(error);
        }
    },
);
export { usersRouter };
