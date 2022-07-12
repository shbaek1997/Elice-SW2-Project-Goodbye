import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user-service';
import { willService } from '../services/will-service';
import { receiverService } from '../services/receiver-service';

//ts-node에서 typeRoot인지 type인지는 모르겠으나, --file 옵션을 package.json이나 file:true를 tsconfig에 해주지 않으면 적용이 안된다고 함.
declare global {
    namespace Express {
        interface User {
            _id: string;
        }
    }
}
const checkUserValidity = (req: Request, userId:string)=>{
    if (!req.user){
        throw new Error('유저가 존재하지 않습니다.')
    }
    const loggedInUserId = req.user._id.toString();
    const isUserIdValid = loggedInUserId === userId;
    if (!isUserIdValid) {
        throw new Error('유저 토큰 정보가 일치하지 않습니다.');
    }
    return true;
}

const authRouter = Router();
authRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user){
            throw new Error('유저가 존재하지 않습니다.');
        }
        const userId = req.user._id;
        // const userIdReal= req.user._id;
        res.status(200).json({ userId });
    } catch (error) {
        next(error);
    }
});

authRouter.patch(
    '/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // is로 req.body 확인 필요?
            // params로부터 id를 가져옴
            // 이부분을 따로 함수같이 빼는 것을 고려
            const { userId } = req.params;
            // if (!req.user){
            //     throw new Error('유저가 존재하지 않습니다.')
            // }
            // const loggedInUserId = req.user._id.toString();
            // const isUserIdValid = loggedInUserId === userId;
            // if (!isUserIdValid) {
            //     throw new Error('유저 토큰 정보가 일치하지 않습니다.');
            // }
            checkUserValidity(req, userId);

            // body data 로부터 업데이트할 사용자 정보를 추출함.
            const { fullName, password, dateOfBirth, photo, currentPassword } =
                req.body;
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

// 회원 탈퇴 api
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
            const deletedUserInfo = await userService.deleteUser(
                userInfoRequired,
            );
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

authRouter.post(
    '/:userId/will',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req,userId);
            // will collection에 추가
            // receivers 부분을 클라이언트가 잘 찾아서 바디에 넣기가 쉽나? 그러면 전혀 문제가 없을 듯
            const { title, content, receivers } = req.body;
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
authRouter.post(
    '/:userId/receiver',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            checkUserValidity(req, userId);
            // receiver collection에 추가
            const { fullName, emailAddress, relation, role } = req.body;
            const newReceiver = await receiverService.addReceiver({
                fullName,
                emailAddress,
                userId,
                relation,
                role,
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
            console.log(updatedUser);
            // wills들 중, receiver가 들어가 있다면, 모든 해당하는 유언장에서 지워야함.
            // 이부분은 좀 있다가 수정하자..
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
            const { fullName, emailAddress, relation, role } = req.body;
            const toUpdate = {
                ...(fullName && { fullName }),
                ...(emailAddress && { emailAddress }),
                ...(relation && { relation }),
                ...(role && { role }),
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
