import { Types } from 'mongoose';
import {
    ICreateRemembrance,
    IUpdateRemembrance,
    RemembranceModel,
    remembranceModel,
    ResRemembrance,
} from '../db';

class RemembranceService {
    remembranceModel: RemembranceModel;

    constructor() {
        this.remembranceModel = remembranceModel;
    }

    // 새 추모 생성
    addRemembrance(
        remembranceInfo: ICreateRemembrance,
    ): Promise<ResRemembrance> {
        const createdNewRemembrance =
            this.remembranceModel.create(remembranceInfo);

        return createdNewRemembrance;
    }

    // 전체 사망한 유저의 추모 데이터 조회
    getRemembrances(): Promise<ResRemembrance[]> {
        const remembrances = this.remembranceModel.find();

        return remembrances;
    }

    // 최근 업데이트 추모 조회
    getRecentRemembrances(count: number): Promise<ResRemembrance[]> {
        const remembrances = this.remembranceModel.findRecent(count);

        return remembrances;
    }

    // remembranceId로 특정 추모 조회
    getRemembranceById(remembranceId: string): Promise<ResRemembrance> {
        const remembrance = this.remembranceModel.findById(remembranceId);

        return remembrance;
    }

    // userId로 특정 추모 조회
    getRemembranceByUser(userId: string): Promise<ResRemembrance> {
        const remembrance = this.remembranceModel.findByUserId(userId);

        return remembrance;
    }

    // 추모의 유저 정보 수정
    setRemembrance(
        userId: string,
        update: IUpdateRemembrance,
    ): Promise<ResRemembrance> {
        const remembrance = this.remembranceModel.update(userId, update);

        return remembrance;
    }

    // 추모글 추가 및 삭제
    setComment(
        remembranceId: string,
        commentId: Types.ObjectId,
        action: 'add' | 'delete',
    ): void {
        if (action === 'add') {
            this.remembranceModel.updateComment(remembranceId, {
                $push: {
                    comments: commentId,
                },
            });
        } else if (action === 'delete') {
            this.remembranceModel.updateComment(remembranceId, {
                $pull: {
                    comments: commentId,
                },
            });
        }
    }
}

const remembranceService = new RemembranceService();

export { remembranceService };
