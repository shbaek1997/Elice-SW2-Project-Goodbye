import { Model, model, UpdateQuery, Types } from 'mongoose';
import { RemembranceSchema, IRemembrance } from '../schemas/remembrance-schema';

export interface ResRemembrance extends IRemembrance {
    _id: Types.ObjectId;
}

export interface ICreateRemembrance {
    userId: string;
    fullName: string;
    dateOfBirth: string;
}

export interface IUpdateRemembrance {
    fullName?: string;
    dateOfBirth?: string;
    dateOfDeath?: string;
    photo?: string;
}

export interface IAddComment {
    comments: Array<Types.ObjectId>;
}

export class RemembranceModel {
    Remembrance: Model<IRemembrance>;

    constructor() {
        this.Remembrance = model<IRemembrance>(
            'remembrances',
            RemembranceSchema,
        );
    }

    // 새 추모 데이터 생성
    create(remembranceInfo: ICreateRemembrance): Promise<ResRemembrance> {
        const createdNewRemembrance = this.Remembrance.create(remembranceInfo);

        return createdNewRemembrance;
    }

    // 전체 사망한 유저의 추모 데이터를 업데이트순으로 조회
    async find(): Promise<ResRemembrance[]> {
        const remembrances = await this.Remembrance.find({
            dateOfDeath: { $exists: true },
        }).sort({
            updatedAt: -1,
        });

        return remembrances;
    }

    // 최근 업데이트 추모 조회
    async findRecent(count: number): Promise<ResRemembrance[]> {
        const recentRemembrances = await this.Remembrance.find()
            .sort({ updatedAt: -1 })
            .limit(count);

        return recentRemembrances;
    }

    // objectId를 이용해 특정 추모 조회
    async findById(remembranceId: string): Promise<ResRemembrance> {
        const remembrance = await this.Remembrance.findOne({
            _id: remembranceId,
        });
        if (!remembrance) {
            throw new Error(
                '해당 추모 데이터가 존재하지 않습니다. 다시 확인해주세요.',
            );
        }
        if (!remembrance.dateOfDeath) {
            throw new Error('아직 사망하지 않은 유저입니다.');
        }

        return remembrance.populate('comments');
    }

    // userId를 이용해 특정 추모 조회
    async findByUserId(userId: string): Promise<ResRemembrance> {
        const remembrance = await this.Remembrance.findOne({ userId });
        if (!remembrance) {
            throw new Error(
                '해당 유저의 추모 데이터가 존재하지 않습니다. 다시 확인해주세요.',
            );
        }

        return remembrance;
    }

    // 추모의 유저 데이터 수정
    async update(
        userId: string,
        update: IUpdateRemembrance,
    ): Promise<ResRemembrance> {
        const filter = { userId };
        const option = { returnOriginal: false };

        const updatedRemembrance = await this.Remembrance.findOneAndUpdate(
            filter,
            update,
            option,
        );
        if (!updatedRemembrance) {
            throw new Error('추모 데이터 수정에 실패했습니다.');
        }

        return updatedRemembrance;
    }

    // 추모글 추가 및 삭제
    async updateComment(
        remembranceId: string,
        query: UpdateQuery<IAddComment>,
    ): Promise<void> {
        const filter = { _id: remembranceId };

        await this.Remembrance.findByIdAndUpdate(filter, query);
    }
}

const remembranceModel = new RemembranceModel();

export { remembranceModel };
