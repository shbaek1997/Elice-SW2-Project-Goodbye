import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
    userService,
    willService,
    receiverService,
    remembranceService,
    ImageService,
} from '../services';
import {
    createReceiverJoiSchema,
    updateReceiverJoiSchema,
    createWillJoiSchema,
    updateWillJoiSchema,
    userUpdateJoiSchema,
    updateDeathDayJoiSchema,
} from '../db/schemas/joi-schemas';
import { sendMailTest } from '../services/mail-service';
import { uploadImage } from '../middlewares';
// ts-node에서 typeRoot인지 type인지는 모르겠으나, --file 옵션을 package.json이나 file:true를 tsconfig에 해주지 않으면 적용이 안된다고 함.
declare global {
    namespace Express {
        interface User {
            _id: string;
        }
    }
}
const checkUserValidity = (req: Request, userId: string) => {
    if (!req.user) {
        throw new Error('유저가 존재하지 않습니다.');
    }
    const loggedInUserId = req.user._id.toString();
    const isUserIdValid = loggedInUserId === userId;
    if (!isUserIdValid) {
        throw new Error('유저 토큰 정보가 일치하지 않습니다.');
    }
    return true;
};
const authRouter = Router();

authRouter.get(
    '/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const user = await userService.getUser(userId);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.patch(
    '/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is로 req.body 확인 필요?
            // params로부터 id를 가져옴
            // 이부분을 따로 함수같이 빼는 것을 고려
            const { userId } = req.params;
            checkUserValidity(req, userId);

            // body data 로부터 업데이트할 사용자 정보를 추출함.
            const { fullName, password, dateOfBirth, currentPassword } =
                req.body;

            const isValid = await userUpdateJoiSchema.validateAsync({
                fullName,
                password,
                dateOfBirth,
                currentPassword,
            });
            // currentPassword 없을 시, 진행 불가
            if (currentPassword === password) {
                throw new Error(
                    '새 비밀번호는 현재 비밀번호와 같을 수 없습니다.',
                );
            }

            const userInfoRequired = { userId, currentPassword };

            // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
            // 보내주었다면, 업데이트용 객체에 삽입함.
            const toUpdate = {
                ...(fullName && { fullName }),
                ...(password && { password }),
                ...(dateOfBirth && { dateOfBirth }),
            };
            // 사용자 정보를 업데이트함.
            const updatedUserInfo = await userService.setUser(
                userInfoRequired,
                toUpdate,
            );

            // 비밀번호를 제외한 데이터를 추모에도 반영
            delete toUpdate.password;
            await remembranceService.setRemembrance(userId, toUpdate);

            // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
            res.status(200).json(updatedUserInfo);
        } catch (error) {
            next(error);
        }
    },
);

// 이미지 등록
authRouter.post(
    '/:userId/image',
    uploadImage.single('photo'),
    async (req, res, next) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);

            const { key } = req.file as Express.MulterS3.File;

            const photo = await ImageService.addImage(userId, key);

            res.status(201).json(photo);
        } catch (error) {
            next(error);
        }
    },
);

// 이미지 삭제
authRouter.delete('/:userId/image/:imageUrl', async (req, res, next) => {
    try {
        const { userId, imageUrl } = req.params;
        checkUserValidity(req, userId);

        const result = await ImageService.deleteImage(userId, imageUrl);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

// AuthRouter의 user Patch 시 비슷한 느낌?
// 회원이 자신의 유언장 전송 권한을 줄 api -post 요청과 조금 다른 느낌인데 다른 api를 사용해야 할려나?
// 로직이 나의 trusted-user가 될 사람에게 서비스 관련 이메일과 회원가입 내용이 담긴 이메일을 보냄
// confirmed? true, false로 보여지게 해야하나? - user schema에 userTrust 관련 정보를 등록 (userId없이, confirmed false)
// UserRouter -이메일의 링크를 따라서 온 경우...
// Query를 사용...
// register post 요청
// 회원가입이 안되어 있다면
// (이메일 안의 url에 해당 회원의 아이디를 넣어서 post요청하는 방식?)..
// 성공적인 post요청 이후 confirmation 페이지로 redirect하는 등의 방식..

// 회원 가입이 되어 있다면 login post 요청에 회원의 아이디 정보를 넣을까.. 이것또한 redirect하는 방식으로
// redirect 이후는 authRouter 통해야 하고..

// trusted 회원이 남을 위해서 회원가입하고, 서비스 가입을 함 (확정을 누르게 되는 시점)
// managedUsers 부분에도 confirmed가 들어가 있어야 하나?
// 회원 가입 이 후, 자신이 확정을 한다면 자신의 managedUsers에 회원 아이디 추가, 해당되는 유저의 trustedUser의 confirmed 를 true,
// confirmed란 사실과 trustedUser의 아이디를 추가.

///  이메일을 받은 사람이 유언장 발송 권한을 confirm하기전에 query로 받아온 정보로 managedUsers에 추가하는 api
// homepage/accept?token 부분에 사용하면 될 것 같음.
authRouter.patch(
    '/:userId/confirmation',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);

            // body data 로부터 업데이트할 사용자 정보를 추출함.
            const { token }: any = req.query;
            const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
            const decodedInfo = jwt.verify(token, secretKey);
            const { managedUserEmail, managedUserId }: any = decodedInfo;
            const managedUser = {
                email: managedUserEmail,
                userId: managedUserId,
                confirmed: true,
            };

            // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
            // 보내주었다면, 업데이트용 객체에 삽입함.

            // 사용자 정보를 업데이트함.
            const trustedUserInfo = await userService.setManagedUsers(
                userId,
                managedUser,
            );
            /// 이메일을 발송한 사람에 대한 정보업데이트
            const managedUserInfo: any = await userService.getUser(
                managedUserId,
            );
            const { trustedUser } = managedUserInfo;
            const { email } = trustedUser;
            const updatedTrustedUser = {
                email,
                userId,
                confirmed: true,
            };
            const toUpdateTrustedUser = {
                trustedUser: updatedTrustedUser,
            };
            const updatedManagedUserInfo =
                await userService.confirmManagedUsers(
                    managedUserId,
                    toUpdateTrustedUser,
                );
            const result = {
                mainUserInfo: updatedManagedUserInfo,
                trustedUserInfo,
            };
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
);

// 자신이 유언장 전송 권한을 주고 싶은 email 주소를 입력하여서 그 이메일 주소를 trusted user 정보에 등록하고,
// 그 이메일 주소로 서비스 관련 이메일 전송
authRouter.patch(
    '/:userId/trustedUser',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 우선은 한번 설정하면 수정이 불가능하게 해야하나...?
            // 이메일 받아서 가입한 유저 아이디 확인
            const { userId } = req.params;
            checkUserValidity(req, userId);
            // body로 이메일 정보 + 현재 비밀번호 받아오기
            const { email, currentPassword } = req.body;
            const user = await userService.getUser(userId);
            if (!user) {
                throw new Error('해당 유저를 찾을 수 없습니다.');
            }
            const possibleTrustedUser = user.trustedUser;
            const possibleTrustedUserEmail = possibleTrustedUser?.email;
            const possibleTrustedUserId = possibleTrustedUser?.userId;
            console.log(possibleTrustedUser);
            console.log(possibleTrustedUserEmail);
            if (email === possibleTrustedUserEmail) {
                throw new Error(
                    '이미 등록되어 있는 신뢰하는 유저 이메일입니다.',
                );
            }
            // possible trusted user가 있든 없든 우선 새 신뢰유저로 정보 업데이트 + 이메일 전송
            const userInfoRequired = { userId, currentPassword };
            const newTrustedUser = { email, confirmed: false };
            const toUpdate = { trustedUser: newTrustedUser };
            const updatedUserInfo = await userService.setUser(
                userInfoRequired,
                toUpdate,
            );
            // mail 전송하는 부분을 여기서 작성하는게 편할까?
            const { fullName }: any = user;
            // userId와 email 정보를 담을 token값 생성
            const secretKey = process.env.JWT_SECRET_KEY || 'secret-key'; // login 성공시 key값을 써서 토큰 생성
            const token = jwt.sign(
                {
                    managedUserId: userId,
                    managedUserEmail: user.email,
                    trustedUserEmail: email,
                },
                secretKey,
            );
            const receivers = [email];
            // url link 에 포함될 homepage 변수 세팅
            const homepage = process.env.HOMEPAGE;
            const subject = `Project Goodbye 서비스의 ${fullName}님이 고객님에게 관리자 역할을 요청하였습니다.`;
            const html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Invitation Email</title>
                </head>
                <body>
                    <h1>Project Goodbye의 서비스에 가입해주세요!</h1>
                    <p>
                        Project Goodbye의 서비스를 이용 중이신 ${fullName}님이 당신을
                        신뢰하는 사람으로 설정하였습니다.
                    </p>
                    <p>
                        Project Goodbye의 유언장 서비스는 미리 작성한 유언장을 지인들
                        이메일로 전달하는 서비스입니다. 다만, 각 회원님의 생사여부는 저희
                        서비스가 판단 할 수 없기에 회원님은 생사여부를 판단해 줄 신뢰하는
                        사람을 정하게 됩니다. 신뢰하는 사람으로 지정되신 당신에게
                        회원가입/로그인을 요청드립니다!
                    </p>
                    <p>
                        회원가입, 로그인 이 후에는 ${fullName}님의 신뢰하는 유저가 되는 것을
                        확정해주시면 됩니다.
                    </p>
                    <p>
                        이미 Project Goodbye의 기존 회원님이시라면 <a href="${homepage}/sign_in?redirectUrl=${homepage}/accept?token=${token}">이 링크</a>를
                        클릭해주세요.
                    </p>

                    <p>
                        Project Goodbye에 처음 가입하신다면 <a href="${homepage}/sign_up?redirectUrl=${homepage}/sign_in?redirectUrl=${homepage}/accept?token=${token}">이 링크</a>를
                        클릭해주세요.
                    </p>
                </body>
            </html>
            `;
            sendMailTest(receivers, subject, html);
            // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
            // 기존 등록유저가 있었다면 기존 등록 유저에서 정보 삭제
            let isUpdated: boolean = false;
            if (possibleTrustedUserId) {
                isUpdated = true;
                // data 삭제;
                await userService.removeManagedUsers(
                    possibleTrustedUserId,
                    userId,
                );
            }

            res.status(200).json({ updatedUserInfo, token, isUpdated });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    '/:userId/managedUsers/:managedUserId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 신뢰 받는 유저가 로그인 하여서 신뢰받는 userId와 관리하는 managedUserId를 params로 받아옴
            const { userId, managedUserId } = req.params;
            checkUserValidity(req, userId);
            // managedUser 객체 받아옴
            const managedUser = await userService.getUser(managedUserId);
            // 이름과 신뢰받는 유저 정보
            const { trustedUser, fullName }: any = managedUser;
            const trustedUserId = trustedUser.userId;
            // 신뢰받는 유저 정보와 유저아이디가 일치하지 않으면 뭔가 잘못된거임.
            if (trustedUserId !== userId) {
                throw new Error(
                    '해당 유저에 대한 유언장 발송 권한이 없습니다.',
                );
            }
            // 사망일자는 body에서 모달 같은 방식으로 받아옴.
            const { dateOfDeath } = req.body;
            const toUpdate = { dateOfDeath };
            // 사망했으므로 추모 정보 업데이트
            await updateDeathDayJoiSchema.validateAsync(toUpdate);
            // 유저의 사망일을 등록하고 추모 정보를 가져옴
            const remembrance = await remembranceService.setRemembrance(
                managedUserId,
                toUpdate,
            );
            // 추모 정보 중 추모 id 값이 필요함.
            const remebranceId = remembrance._id;
            // 비슷하게 유저의 유언장들 정보를 가져옴
            const wills = await willService.findWillsForOneUser(managedUserId);
            // url link 에 포함될 homepage 변수 세팅
            const homepage = process.env.HOMEPAGE;
            // 유언장 마다 같은 양식의 이메일 전송
            wills.forEach((will) => {
                const receiversEmails: string[] = [];
                const { receivers, _id } = will;
                const willId = _id;
                if (receivers.length === 0) {
                    return;
                }
                receivers.forEach((receiver: any) =>
                    receiversEmails.push(receiver.email),
                );
                const subject = `Project Goodbye: ${fullName}으로부터 유언장이 도착했습니다`;
                const html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>유언장</title>
                </head>
                <body>
                    <h1>${fullName}님으로부터 유언장이 도착했습니다</h1>
                    <p>Project Goodbye의 서비스는 유언장을 링크를 통하여 전달해드립니다.</p>
                    <p>유언장을 열람하시려면 <a href="${homepage}/will_check_page?willId=${willId}">이 링크</a>를 클릭 후, 이 이메일을 받은 이메일 주소를 입력하시면 됩니다.</p>
                    <p>${fullName}님의 추모식에 참여를 원하시면 <a href="${homepage}/remembrance?remembranceId=${remebranceId}">이 링크</a>를 클릭하시면 됩니다.</p>
                </body>
                </html>`;
                sendMailTest(receiversEmails, subject, html);
            });
            // 성공시 result-success 응답.
            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

// 회원 탈퇴 api
authRouter.delete(
    '/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const currentPassword = req.get('password');
            if (!currentPassword) {
                throw new Error(
                    '정보를 변경하려면, 현재의 비밀번호가 필요합니다.',
                );
            }

            const userInfoRequired = { userId, currentPassword };
            // 유저 정보 유저 변수에 저장
            const user: any = await userService.getUser(userId);
            // 유저 삭제
            const deletedUserInfo = await userService.deleteUser(
                userInfoRequired,
            );
            // 해당 유저의 유언장과 수신자 정보 삭제
            const { wills, receivers } = user;
            wills.forEach(async (willId: string) => {
                await willService.deleteWill(willId);
            });
            receivers.forEach(async (receiverId: string) => {
                await receiverService.deleteReceiver(receiverId);
            });
            // 해당 유저의 추모 데이터도 삭제
            remembranceService.deleteRemembrance(userId);

            // 만약에 정상적으로 delete가 되어서 delete한 유저 정보가 있다면,
            if (deletedUserInfo) {
                res.status(200).json({ result: 'success' });
            }
        } catch (error) {
            next(error);
        }
    },
);

// userId 로 유언장 리스트 전부 get 요청 - 유저아이디만 더블 체크 후
// userId로 유언장을 post 경우, userId 정상 여부 확인 => 정상이라면, user의 willList에 push, 동시에 willSchema에 create method 사용..

// authrouter- will post, get, patch, delete

authRouter.get(
    '/:userId/wills',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const willList = await willService.findWillsForOneUser(userId);
            res.status(200).json(willList);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.get(
    '/:userId/wills/:willId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, willId } = req.params;
            checkUserValidity(req, userId);
            const willFound = await willService.findWill(willId);
            res.status(200).json(willFound);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    '/:userId/wills',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            // will collection에 추가
            // receivers 부분을 클라이언트가 잘 찾아서 바디에 넣기가 쉽나? 그러면 전혀 문제가 없을 듯
            const { title, content, receivers } = req.body;
            const isValid = await createWillJoiSchema.validateAsync({
                title,
                content,
                receivers,
            });
            const newWill = await willService.addWill({
                title,
                content,
                userId,
                receivers,
            });
            // 유저의 will list에 추가
            const updatedUser = await userService.addWill(userId, newWill._id);
            res.status(200).json(newWill);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.delete(
    '/:userId/wills/:willId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, willId } = req.params;
            checkUserValidity(req, userId);
            // collection에서 삭제
            const deletedWill = await willService.deleteWill(willId);
            if (!deletedWill) {
                throw new Error('해당 유언장은 존재하지 않습니다.');
            }
            // user의 wills에서 제거
            const updatedUser = await userService.deleteWill(userId, willId);
            console.log(updatedUser);
            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.patch(
    '/:userId/wills/:willId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, willId } = req.params;
            checkUserValidity(req, userId);
            const { title, content, receivers } = req.body;
            const isValid = await updateWillJoiSchema.validateAsync({
                title,
                content,
                receivers,
            });
            const toUpdate = {
                ...(title && { title }),
                ...(content && { content }),
                ...(receivers && { receivers }),
            };
            const updatedWill = await willService.updateWill(willId, toUpdate);
            res.status(200).json(updatedWill);
        } catch (error) {
            next(error);
        }
    },
);

/// ////
/// ////////////////////////////
// receiver
// 흠 receiver를 작성후 유언장에 추가하는 방식인가? 그러면 유언장 생성 시에 유언장 db에 수신자를 저장하는 건가?
// 유언장 작성 시 바로 수신자를 바로 만드는 방식인가?

// 유저와 유언장, 수신자의 관계는 쉬운편인거 같은데 - 유언장/수신자의 관계에서 삭제, 추가, 수정이 미치는 영향을 더 생각

authRouter.get(
    '/:userId/receivers',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const receiverList = await receiverService.findReceiversForOneUser(
                userId,
            );
            res.status(200).json(receiverList);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.get(
    '/:userId/receivers/:receiverId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, receiverId } = req.params;
            checkUserValidity(req, userId);
            const receiverFound = await receiverService.findReceiver(
                receiverId,
            );
            res.status(200).json(receiverFound);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.post(
    '/:userId/receivers',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            // receiver collection에 추가
            const { fullName, emailAddress, relation } = req.body;
            const isValid = await createReceiverJoiSchema.validateAsync({
                fullName,
                emailAddress,
                relation,
            });
            const newReceiver = await receiverService.addReceiver({
                fullName,
                emailAddress,
                userId,
                relation,
            });
            // 유저의 receiver list에 추가
            const updatedUser = await userService.addReceiver(
                userId,
                newReceiver._id,
            );
            res.status(200).json(newReceiver);
        } catch (error) {
            next(error);
        }
    },
);

authRouter.delete(
    '/:userId/receivers/:receiverId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, receiverId } = req.params;
            checkUserValidity(req, userId);
            // receiver collection에서 제거
            const deletedReceiver = await receiverService.deleteReceiver(
                receiverId,
            );
            if (!deletedReceiver) {
                throw new Error('해당 수신자는 등록되어 있지 않습니다.');
            }
            // user의 receivers에서 제거
            const updatedUser = await userService.deleteReceiver(
                userId,
                receiverId,
            );
            // wills들 중, receiver가 들어가 있다면, 모든 해당하는 유언장에서 지워야함.
            // 이부분은 좀 있다가 수정하자..
            // const updatedWills
            const user: any = await userService.getUser(userId);

            const { wills } = user;
            console.log(user.wills);
            wills.forEach(async (willId: string) => {
                await willService.deleteReceiver(willId, receiverId);
            });

            // console.log('wills: ' +wills);

            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

authRouter.patch(
    '/:userId/receivers/:receiverId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, receiverId } = req.params;
            checkUserValidity(req, userId);
            const { fullName, emailAddress, relation } = req.body;
            const isValid = await updateReceiverJoiSchema.validateAsync({
                fullName,
                emailAddress,
                relation,
            });
            const toUpdate = {
                ...(fullName && { fullName }),
                ...(emailAddress && { emailAddress }),
                ...(relation && { relation }),
            };
            const updatedReceiver = await receiverService.updateReceiver(
                receiverId,
                toUpdate,
            );
            res.status(200).json(updatedReceiver);
        } catch (error) {
            next(error);
        }
    },
);

// 유저의 추모 데이터 조회
authRouter.get('/:userId/remembrances', async (req, res, next) => {
    try {
        const { userId } = req.params;
        checkUserValidity(req, userId);

        const remembrance = await remembranceService.getRemembranceByUser(
            userId,
        );

        res.status(200).json(remembrance);
    } catch (error) {
        next(error);
    }
});

export { authRouter };
