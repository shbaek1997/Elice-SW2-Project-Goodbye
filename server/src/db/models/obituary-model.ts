import { Model, model } from 'mongoose';
import { IFamily, IObituary, ObituarySchema } from '../schemas/obituary-schema';

export interface IUpdateObituary {
    deceased?: string;
    dateOfBirth?: string;
    dateOfDeath?: string;
    age: number;
    sex?: string;
    family?: Array<IFamily>;
    funeral?: string;
    dateOfCremate?: string;
    comment?: string;
}

export class ObituaryModel {
    Obituary: Model<IObituary>;

    constructor() {
        this.Obituary = model<IObituary>('obituaries', ObituarySchema);
    }

    // 새 부고 생성
    async create(obituaryInfo: IObituary): Promise<IObituary> {
        const createdNewObituary = await this.Obituary.create(obituaryInfo);

        return createdNewObituary;
    }

    // objectId를 이용해 특정 부고 조회
    async findById(obituaryId: string): Promise<IObituary> {
        const obituary = await this.Obituary.findOne({
            _id: obituaryId,
        });
        if (!obituary) {
            throw new Error(
                '해당 부고는 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return obituary;
    }

    // 부고 수정
    async update(
        obituaryId: string,
        update: IUpdateObituary,
    ): Promise<IObituary> {
        const filter = { _id: obituaryId };
        const option = { returnOriginal: false };

        const updatedObituary = await this.Obituary.findOneAndUpdate(
            filter,
            update,
            option,
        );
        if (!updatedObituary) {
            throw new Error('부고 수정에 실패했습니다.');
        }

        return updatedObituary;
    }

    // 부고 삭제
    async delete(obituaryId: string): Promise<IObituary> {
        const filter = { _id: obituaryId };

        const deletedObituary = await this.Obituary.findOneAndDelete(filter);
        if (!deletedObituary) {
            throw new Error('부고 삭제에 실패했습니다.');
        }

        return deletedObituary;
    }
}

const obituaryModel = new ObituaryModel();

export { obituaryModel };
