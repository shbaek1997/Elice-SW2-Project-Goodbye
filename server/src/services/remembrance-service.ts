import { Types } from 'mongoose';
import {
    createRemembranceJoiSchema,
    updateRemembranceJoiSchema,
} from '../db/schemas/joi-schemas/remembrance-joi-schema';
import { IUpdateRemembrance, RemembranceModel, remembranceModel } from '../db';
import { userService } from './user-service';

class RemembranceService {
    remembranceModel: RemembranceModel;

    constructor() {
        this.remembranceModel = remembranceModel;
    }

    // 새 추모 생성
    async addRemembrance(userId: string, dateOfDeath: string) {
        // 해당 유저의 추모 데이터가 존재하는지 확인
        const remembrances = await this.remembranceModel.findByUserId(userId);
        if (remembrances.length) {
            throw new Error('해당 유저의 추모 데이터가 이미 존재합니다.');
        }

        // 추모 대상자 확인을 위해 유저 정보 조회
        const user = await userService.getUser(userId);
        if (!user) {
            throw new Error('해당 유저가 존재하지 않습니다.');
        }

        const remembranceInfo = {
            userId,
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            dateOfDeath,
            ...(user.photo && { photo: user.photo }),
        };
        await createRemembranceJoiSchema.validateAsync(remembranceInfo);

        const createdNewRemembrance = await this.remembranceModel.create(
            remembranceInfo,
        );

        return createdNewRemembrance;
    }

    // 최근 업데이트 추모 조회
    async getRecentRemembrances(count: number) {
        const remembrances = await this.remembranceModel.findRecent(count);

        return remembrances;
    }

    // 특정 추모 조회
    async getRemembranceById(remembranceId: string) {
        const remembrance = await this.remembranceModel.findById(remembranceId);
        if (!remembrance) {
            throw new Error(
                '해당 추모는 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return remembrance.populate('comments');
    }

    // 추모 수정
    async setRemembrance(remembranceId: string, update: IUpdateRemembrance) {
        await updateRemembranceJoiSchema.validateAsync(update);
        const remembrance = await this.remembranceModel.update(
            remembranceId,
            update,
        );

        return remembrance;
    }

    // 추모글 추가 및 삭제
    setComment(remembranceId: string, commentId: Types.ObjectId, type: string) {
        switch (type) {
            case 'add':
                this.remembranceModel.updateComment(remembranceId, {
                    $push: {
                        comments: commentId,
                    },
                });
                break;
            case 'delete':
                this.remembranceModel.updateComment(remembranceId, {
                    $pull: {
                        comments: commentId,
                    },
                });
                break;
            default:
                throw new Error('type이 잘못 지정되었습니다.');
        }
    }
}

const remembranceService = new RemembranceService();

export { remembranceService };
