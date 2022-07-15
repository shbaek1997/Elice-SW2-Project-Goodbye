import { model, Model } from 'mongoose';
import { InterfaceReceiver, ReceiverSchema } from '../schemas/receiver-schema';

export class ReceiverModel {
    Receiver: Model<InterfaceReceiver>;

    constructor() {
        this.Receiver = model<InterfaceReceiver>('receivers', ReceiverSchema);
    }

    async findById(receiverId: string) {
        const receiver = await this.Receiver.findOne({ _id: receiverId });
        return receiver;
    }

    async create(receiverInfo: InterfaceReceiver) {
        const createdNewReceiver = await this.Receiver.create(receiverInfo);
        return createdNewReceiver;
    }

    async deleteById(receiverId: string) {
        const deletedReceiver = await this.Receiver.findOneAndDelete({
            _id: receiverId,
        });
        return deletedReceiver;
    }

    async updateById(receiverId: string, update: InterfaceReceiver) {
        const filter = { _id: receiverId };
        const option = { returnOriginal: false };
        const updatedReceiver = await this.Receiver.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedReceiver;
    }

    async findReceiversByUserId(userId: string) {
        const receivers = await this.Receiver.find({ userId });
        return receivers;
    }
}

const receiverModel = new ReceiverModel();

export { receiverModel };
