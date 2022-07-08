import { model } from 'mongoose';
import { RemembranceSchema } from '../schemas/remembrance-schema';

class RemembranceModel {
    constructor() {
        this.Remembrance = model('remembrances', RemembranceSchema);
    }

    // 새 추모 데이터 생성
    async create(remembranceInfo) {
        const createdNewRemembrance = await this.Remembrance.create(
            remembranceInfo,
        );

        return createdNewRemembrance;
    }

    // 최근 업데이트 추모 조회
    async findRecent(count) {
        const recentRemembrances = await this.Remembrance.find()
            .sort({ updatedAt: -1 })
            .limit(count);

        return recentRemembrances;
    }

    // objectId를 이용해 특정 추모 조회
    async findById(remembranceId) {
        const remembrance = await this.Remembrance.findOne({
            _id: remembranceId,
        });

        return remembrance;
    }

    // 전체 추모글 조회 함수 따로 필요한가? ↑ 얘로 충분?

    // ObjectId를 이용해 특정 추모글 조회
    async findCommentById(remembranceId, commentId) {
        const comment = await this.Remembrance.findOne(
            {
                _id: remembranceId,
                'comments._id': commentId,
            },
            {
                'comments.$': true,
            },
        );

        return comment;
    }

    // 추모 데이터 수정
    async update(remembranceId, update) {
        const filter = { _id: remembranceId };
        const option = { returnOriginal: false };

        const updatedRemembrance = await this.Remembrance.findOneAndUpdate(
            filter,
            update,
            option,
        );

        return updatedRemembrance;
    }

    // 추모글 추가
    async createComment(remembranceId, commentInfo) {
        const filter = { _id: remembranceId };
        const option = { returnOriginal: false };

        const updatedRemembrance = await this.Remembrance.findOneAndUpdate(
            filter,
            {
                $push: {
                    comments: commentInfo,
                },
            },
            option,
        );

        return updatedRemembrance;
    }

    // 추모글 수정
    async updateComment(remembranceId, commentId, update) {
        const filter = {
            _id: remembranceId,
            'comments._id': commentId,
        };
        const option = { returnOriginal: false };

        const updatedRemembrance = await this.Remembrance.findOneAndUpdate(
            filter,
            { $set: { 'comments.$': update } },
            option,
        );

        return updatedRemembrance;
    }

    // 추모글 삭제
    async deleteComment(remembranceId, commentId) {
        const filter = { _id: remembranceId };

        const deletedRemembrance = await this.Remembrance.findOneAndUpdate(
            filter,
            {
                $pull: {
                    comments: { _id: commentId },
                },
            },
        );

        return deletedRemembrance;
    }

    // 추모 데이터 삭제 필요?
}

const remembranceModel = new RemembranceModel();

export { remembranceModel };
