import { model, Model } from 'mongoose';
import type { InterfaceWill } from '../schemas/will-schema';
import { WillSchema } from '../schemas/will-schema';

export class WillModel {
    Will: Model<InterfaceWill>;

    constructor() {
        this.Will = model<InterfaceWill>('wills', WillSchema);
    }

    async findById(willId: string) {
        const will = await this.Will.findOne({ _id: willId });
        return will;
    }

    async create(willInfo: InterfaceWill) {
        const createdNewWill = await this.Will.create(willInfo);
        return createdNewWill;
    }

    async deleteById(willId: string) {
        const deletedWill = await this.Will.findOneAndDelete({ _id: willId });
        return deletedWill;
    }
    // update부분의 interface가 다를지도? 그냥 여기만 any?

    async updateById(willId: string, update: InterfaceWill) {
        const filter = { _id: willId };
        const option = { returnOriginal: false };
        const updatedWill = await this.Will.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedWill;
    }

    async findWillsByUserId(userId: string) {
        const wills = await this.Will.find({ userId });
        return wills;
    }

    async deleteReceiver(willId: string, receiverId: string) {
        const receiverDeletedWill = await this.Will.updateOne(
            { _id: willId },
            { $pull: { receivers: receiverId } },
        );
        return receiverDeletedWill;
    }
}

const willModel = new WillModel();

export { willModel };
