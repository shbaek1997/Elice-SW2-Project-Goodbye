import { model } from 'mongoose';
import { ReceiverSchema } from '../schemas/receiver-schema';

const Receiver = model('receivers', ReceiverSchema);

export class RecieverModel {
    async findById(receiverId) {
        const receiver = await Receiver.findOne({ _id: receiverId });
        return receiver;
    }

    async create(receiverInfo) {
        const createdNewReceiver = await Receiver.create(receiverInfo);
        return createdNewReceiver;
    }

    async deleteById(receiverId) {
        const deletedReceiver = await Receiver.findOneAndDelete({
            _id: receiverId,
        });
        return deletedReceiver;
    }

    async updateById(receiverId, update) {
        const filter = { _id: receiverId };
        const option = { returnOriginal: false };
        const updatedReceiver = await Receiver.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedReceiver;
    }
    async findReceiversByUserId(userId) {
        const receivers = await Receiver.find({ userId });
        return receivers;
    }
}

const receiverModel = new RecieverModel();

export { receiverModel };
