import { Model, model } from 'mongoose';
import { IComment } from '../schemas/comment-schema';
import { RemembranceSchema, IRemembrance } from '../schemas/remembrance-schema';

export class RemembranceModel {
    Remembrance: Model<IRemembrance>;

    constructor() {
        this.Remembrance = model<IRemembrance>(
            'remembrances',
            RemembranceSchema,
        );
    }

    // 새 추모 데이터 생성
    async create(remembranceInfo: IRemembrance) {
        const createdNewRemembrance = await this.Remembrance.create(
            remembranceInfo,
        );

        return createdNewRemembrance;
    }

    // 최근 업데이트 추모 조회
    async findRecent(count: number) {
        const recentRemembrances = await this.Remembrance.find()
            .sort({ updatedAt: -1 })
            .limit(count);

        return recentRemembrances;
    }

    // objectId를 이용해 특정 추모 조회
    async findById(remembranceId: string) {
        const remembrance = await this.Remembrance.findOne({
            _id: remembranceId,
        });

        return remembrance;
    }

    // 전체 추모글 조회 함수 따로 필요한가? ↑ 얘로 충분?

    // ObjectId를 이용해 특정 추모글 조회
    async findCommentById(remembranceId: string, commentId: string) {
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
    async update(remembranceId: string, update: object) {
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
    async createComment(remembranceId: string, commentInfo: IComment) {
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
    async updateComment(
        remembranceId: string,
        commentId: string,
        update: IComment,
    ) {
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
    async deleteComment(remembranceId: string, commentId: string) {
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
