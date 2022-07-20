import { Types } from 'mongoose';
import { updateRemembranceJoiSchema } from '../db/schemas/joi-schemas/remembrance-joi-schema';
import { IUpdateRemembrance, RemembranceModel, remembranceModel } from '../db';

interface ICreateRemembrance {
    userId: string;
    fullName: string;
    dateOfBirth: string;
}

class RemembranceService {
    remembranceModel: RemembranceModel;

    constructor() {
        this.remembranceModel = remembranceModel;
    }

    // 새 추모 생성
    async addRemembrance(remembranceInfo: ICreateRemembrance) {
        const { userId } = remembranceInfo;

        // 해당 유저의 추모 데이터가 존재하는지 확인
        const remembrance = await this.remembranceModel.findByUserId(userId);
        if (remembrance) {
            throw new Error('해당 유저의 추모 데이터가 이미 존재합니다.');
        }

        const createdNewRemembrance = await this.remembranceModel.create(
            remembranceInfo,
        );

        return createdNewRemembrance;
    }

    // 전체 추모 데이터 조회
    async getRemembrances() {
        const remembrances = await this.remembranceModel.find();

        return remembrances;
    }

    // 최근 업데이트 추모 조회
    async getRecentRemembrances(count: number) {
        const remembrances = await this.remembranceModel.findRecent(count);

        return remembrances;
    }

    // remembranceId로 특정 추모 조회
    async getRemembranceById(remembranceId: string) {
        const remembrance = await this.remembranceModel.findById(remembranceId);
        if (!remembrance) {
            throw new Error(
                '해당 추모는 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return remembrance.populate('comments');
    }

    // userId로 특정 추모 조회
    async getRemembranceByUser(userId: string) {
        const remembrance = await this.remembranceModel.findByUserId(userId);
        if (!remembrance) {
            throw new Error(
                '해당 유저의 추모 데이터가 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return remembrance;
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
