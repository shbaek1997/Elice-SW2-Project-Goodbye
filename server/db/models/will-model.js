import { model } from 'mongoose';
import { WillSchema } from '../schemas/will-schema';

const Will = model('wills', WillSchema);

export class WillModel {
    async findById(willId) {
        const will = await Will.findOne({ _id: willId });
        return will;
    }

    async create(willInfo) {
        const createdNewWill = await Will.create(willInfo);
        return createdNewWill;
    }

    async deleteById(willId) {
        const deletedWill = await Will.findOneAndDelete({ _id: willId });
        return deletedWill;
    }

    async updateById(willId, update) {
        const filter = { _id: willId };
        const option = { returnOriginal: false };
        const updatedWill = await Will.findOneAndUpdate(filter, update, option);
        return updatedWill;
    }
    async findWillsByUserId(userId) {
        const wills = await Will.find({ userId });
        return wills;
    }
}

const willModel = new WillModel();

export { willModel };
