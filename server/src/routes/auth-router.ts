import { Router, Request, Response, NextFunction } from 'express';
import {
    userService,
    willService,
    receiverService,
    ImageService,
} from '../services';
import {
    createReceiverJoiSchema,
    updateReceiverJoiSchema,
} from '../db/schemas/joi-schemas/receiver-joi-schema';
import {
    createWillJoiSchema,
    updateWillJoiSchema,
} from '../db/schemas/joi-schemas/will-joi-schema';
import { userUpdateJoiSchema } from '../db/schemas/joi-schemas/user-joi-schema';
import { uploadImage } from '../middlewares';
import { InterfaceUserResult } from '../db/schemas/user-schema';
import { sendMailTest } from '../services/mail-service';
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

/**
 * @swagger
 * /api/auth/{userId}/isLoggedIn:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthUser]
 *     summary: 유저가 로그인이 되어있다면, result-"success"를 반환하는 API
 *     description: 유저가 로그인이 되어있다면, result- "success"를 반환 (jwt token 값이 올바르다면)
 *     responses:
 *       200:
 *         description: result success
 *
 */

authRouter.get(
    '/:userId/isLoggedIn',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            res.status(200).json({ result: 'success' });
        } catch (error) {
            next(error);
        }
    },
);

/**
 * @swagger
 * /api/auth/{userId}:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthUser]
 *     summary: 유저의 회원 정보 수정 시 사용하는 API
 *     description: 유저가 회원가입 post요청 시, currentPassword로 password 확인 후 관련된 정보 들을 req.body로 받아 유저 정보 수정하는 API
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Updated User as JSON
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */

authRouter.patch(
    '/:userId',
    uploadImage.single('photo'),
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
            // s3에 이미지 업로드 후 url 반환
            const photo = ImageService.addImage(
                req.file as Express.MulterS3.File,
            );

            // const isValid = await userUpdateJoiSchema.validateAsync({
            //     fullName,
            //     password,
            //     dateOfBirth,
            //     currentPassword,
            //     photo,
            // });
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
                ...(photo && { photo }),
            };

            // 사용자 정보를 업데이트함.
            const updatedUserInfo = await userService.setUser(
                userInfoRequired,
                toUpdate,
            );

            // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
            res.status(200).json(updatedUserInfo);
        } catch (error) {
            next(error);
        }
    },
);
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
/**
 * @swagger
 * /api/auth/{userId}/managedUsers:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           required: true
 *       - in: query
 *         name: managedUserId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthTrustAndManage]
 *     summary: 유저에게서 이메일을 받아서 trusted user가 된 사람이 로그인 혹은 회원 가입 후, url query에서 받은 정보로 managedUsers에 초기 등록하는 API
 *     description: 예를 들어서 유저 A가 B가 아들이어서 trusted user로 아들 이메일을 등록, 관련 이메일을 받은 아들 B가 메일의 링크를 따라서 신규 회원을 등록 그 이후에는 A의 trustedUser가 되겠냐는 confirm을 아직 안한 상황에서 우선 B의 정보에 아버지 A의 이메일과 userId 정보가 들어가게 되는 API
 *     responses:
 *       200:
 *         description: 로그인한 유저가 patch 된 이후의 유저 정보 as JSON
 *
 */
authRouter.patch(
    '/:userId/managedUsers',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);

            // body data 로부터 업데이트할 사용자 정보를 추출함.
            const { email, managedUserId } = req.query; // query로 받아온다고 가정

            // const isValid = await userUpdateJoiSchema.validateAsync({
            //     fullName,
            //     password,
            //     dateOfBirth,
            //     currentPassword,
            //     photo,
            // });
            const managedUser = {
                email,
                userId: managedUserId,
                confirm: false,
            };

            // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
            // 보내주었다면, 업데이트용 객체에 삽입함.

            // 사용자 정보를 업데이트함.
            const updatedUserInfo = await userService.setManagedUsers(
                userId,
                managedUser,
            );
            console.log(updatedUserInfo);

            // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
            res.status(200).json(updatedUserInfo);
        } catch (error) {
            next(error);
        }
    },
);
// 유저가 확정을 지어서 trusted user를 확정한 경우 유저 정보를 두명 다 업데이트 하는 api
/**
 * @swagger
 * /api/auth/{userId}/confirmation:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: managedUserId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthTrustAndManage]
 *     summary: 유저가 자신에게 할당된 managedUser에 대하여 confirm 버튼을 눌러서 생사여부 관한 책임을 지겠다고 선언했을 때, 본인과 해당하는 유저 정보 모두 confirmed를 true로 변환하고, 관련 정보를 업데이트하는 API.
 *     description: 예를 들어서 유저 A가 B가 아들이어서 trusted user로 아들 이메일을 등록, B는 로그인 등의 과정을 모두 마친후 A의 생사여부 권한을 받기로 확정, 이 때의 A의 trustedUser의 userId와 confirmed true로 정보를 업데이트하고, 아들 B의 managedUsers의 A에 해당하는 managedUser object의 confirmed 정보 또한 true로 변경하게 되는 API.
 *     responses:
 *       200:
 *         description: mainUserInfo-trustedUser를 처음 신청한 A의 정보, trustedUserInfo- trustedUser가 된 B의 정보 as JSON
 *
 */
authRouter.patch(
    '/:userId/confirmation',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 이메일 받아서 가입한 유저 아이디 확인
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const { managedUserId }: any = req.query; // or body?

            // const isValid = await userUpdateJoiSchema.validateAsync({
            //     fullName,
            //     password,
            //     dateOfBirth,
            //     currentPassword,
            //     photo,
            // });
            /// / confirm을 누른 사용자의 정보 변경
            const userInfo: any = await userService.getUser(userId);
            const { managedUsers } = userInfo;
            managedUsers.map((el) => {
                if (el.userId === managedUserId) {
                    el.confirmed = true;
                    return el;
                }
            });
            const toUpdateManagedUsers = { managedUsers };
            const trustedUserInfo = await userService.confirmManagedUsers(
                userId,
                toUpdateManagedUsers,
            );
            // 이제 자신의 유언장을 보내줄 사람이 정해진 사람 관련 유저 정보 변경
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
            console.log(toUpdateTrustedUser);
            const updatedManagedUserInfo =
                await userService.confirmManagedUsers(
                    managedUserId,
                    toUpdateTrustedUser,
                );
            console.log(managedUserInfo);
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
/**
 * @swagger
 * /api/auth/{userId}/trustedUser:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/TrustedUserInfo'
 *     tags: [AuthTrustAndManage]
 *     summary: 유저가 자신의 유언장 전송, 생사여부를 변경 가능 권한을 주고 싶은 사람의 이메일과 현재 자신 계정의 비밀번호를 입력하면, 해당 이메일 주소로 관련 내용의 이메일을 보내면서, 자신의 trustedUser 정보를 업데이트 하는 API
 *     description: 예를 들어서 유저 A가 B가 아들이어서 B에게 권한을 부여하기로 결정, B의 이메일 주소와 A 계정의 비밀번호를 확인 받고 A의 trustedUser 부분의 email부분이 아들 이메일로 등록됨, 아들은 ProjectGoodbye 서비스 관련 정보가 담긴 이메일을 받고, 이메일에는 링크등을 활용하여 신규유저인 경우 회원 가입, 기존 유저인 경우는 로그인을 해달라는 부탁을 받게 됨. 아직 HTML 부분은 API에서 크게 구현을 안했기 때문에 프론트 분들이 html을 이미 작성하신 양식이 있다면 비슷하게 작성해주시거나 같이 상의해보아요.
 *     responses:
 *       200:
 *         description: 수정된 A의 정보 as JSON
 *
 */
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
            const userInfoRequired = { userId, currentPassword };
            const newTrustedUser = { email, confirmed: false };
            const toUpdate = { trustedUser: newTrustedUser };
            const updatedUserInfo = await userService.setUser(
                userInfoRequired,
                toUpdate,
            );
            // mail 전송하는 부분을 여기서 작성하는게 편할까?
            const user = await userService.getUser(userId);
            const { fullName }: any = user;
            const receivers = [email];
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
                        이미 Project Goodbye의 회원님이시라면 <a href="">이 링크</a>를
                        클릭해주세요.
                    </p>
                    <p>
                        Project Goodbye에 처음 가입하신다면 <a href="">이 링크</a>를
                        클릭해주세요.
                    </p>
                </body>
            </html>
            `;
            sendMailTest(receivers, subject, html);

            // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
            res.status(200).json(updatedUserInfo);
        } catch (error) {
            next(error);
        }
    },
);
// 회원 탈퇴 api

/**
 * @swagger
 * /api/auth/{userId}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthUser]
 *     summary: 유저의 회원 탈퇴 시 사용하는 API
 *     description: 유저가 회원탈퇴 delete 요청 시, DB에 저장되어 있는 해당 유저 정보를 삭제하는 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDelete'
 *     responses:
 *       200:
 *         description: result success as json
 *
 */

authRouter.delete(
    '/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            const { currentPassword } = req.body;
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

            // 유저 관련 유언장과 수신자삭제 완료
            // 추모도 삭제해야하나?
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

/**
 * @swagger
 * /api/auth/{userId}/wills:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthWill]
 *     summary: 유저의 유언장 리스트를 불러오는 API
 *     description: 유저의 uri의 유저 아이디를 통하여 해당 유저의 유언장 리스트를 불러오는 API
 *     responses:
 *       200:
 *         description: Will list as JSON
 *
 */

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

/**
 * @swagger
 * /api/auth/{userId}/wills/{willId}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: willId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthWill]
 *     summary: 유저의 유언장 아이디로 해당 유언장을 불러오는 API
 *     description: 유저의 uri의 유저 아이디와 유언장 아이디를 통하여 해당 유언장을 불러오는 API
 *     responses:
 *       200:
 *         description: Will as JSON
 *
 */

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
/**
 * @swagger
 * /api/auth/{userId}/will:
 *   post:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthWill]
 *     summary: 특정 유저의 유언장을 DB에 등록할 때 사용하는 API
 *     description: 유저가 유언장을 post요청시 req.body의 title, content, receivers 정보를 사용, 새 유언장을 등록
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WillPost'
 *     responses:
 *       200:
 *         description: Created Will as JSON
 *
 */
authRouter.post(
    '/:userId/will',
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
/**
 * @swagger
 * /api/auth/{userId}/wills/{willId}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *       - in: path
 *         name: willId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthWill]
 *     summary: 특정 유저의 특정 유언장을 삭제할 때 사용하는 API
 *     description: 유저가 유언장을 delete 요청시 유언장 정보를 삭제
 *     responses:
 *       200:
 *         description: result success as JSON
 *
 */
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

/**
 * @swagger
 * /api/auth/{userId}/wills/{willId}:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *       - in: path
 *         name: willId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthWill]
 *     summary: 특정 유저의 특정 유언장을 수정할 때 사용하는 API
 *     description: 유저가 유언장을 patch 요청시 req.body의 title, content, receivers 정보를 사용, 유언장 정보를 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WillPost'
 *     responses:
 *       200:
 *         description: Updated Will as JSON
 *
 */
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

/**
 * @swagger
 * /api/auth/{userId}/receivers:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthReceiver]
 *     summary: 유저의 수신자 리스트를 불러오는 API
 *     description: 유저의 uri의 유저 아이디를 통하여 해당 유저의 수신자 리스트를 불러오는 API
 *     responses:
 *       200:
 *         description: Receiver list as JSON
 *
 */
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
/**
 * @swagger
 * /api/auth/{userId}/receivers/{receiverId}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: receiverId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthReceiver]
 *     summary: 유저의 수신자 아이디로 해당 수신자 정보를 불러오는 API
 *     description: 유저의 uri의 유저 아이디와 수신자 아이디를 통하여 해당 수신자 정보를 불러오는 API
 *     responses:
 *       200:
 *         description: Receiver as JSON
 *
 */
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
/**
 * @swagger
 * /api/auth/{userId}/receiver:
 *   post:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthReceiver]
 *     summary: 특정 유저의 수신자를 DB에 등록할 때 사용하는 API
 *     description: 유저가 수신자를 post요청시 req.body의 fullName, emailAddress, relation 정보를 사용, 새 수신자를 등록
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceiverPost'
 *     responses:
 *       200:
 *         description: Created Receiver as JSON
 *
 */

authRouter.post(
    '/:userId/receiver',
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

/**
 * @swagger
 * /api/auth/{userId}/receivers/{receiverId}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *       - in: path
 *         name: receiverId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthReceiver]
 *     summary: 특정 유저의 특정 수신자를 삭제할 때 사용하는 API
 *     description: 유저가 수신자를 delete 요청시 해당 수신자 정보를 삭제
 *     responses:
 *       200:
 *         description: result success as JSON
 *
 */
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
/**
 * @swagger
 * /api/auth/{userId}/receivers/{receiverId}:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *       - in: path
 *         name: receiverId
 *         schema:
 *           type: string
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     tags: [AuthReceiver]
 *     summary: 특정 유저의 특정 수신자 정보를 수정할 때 사용하는 API
 *     description: 유저가 수신자 정보를 patch 요청시 req.body의 fullName, emailAddress, relation 정보를 사용, 수신자 정보를 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceiverPost'
 *     responses:
 *       200:
 *         description: Updated Receiver as JSON
 *
 */
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

export { authRouter };
