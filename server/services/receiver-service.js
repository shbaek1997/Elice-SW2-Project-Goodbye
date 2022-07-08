import { receiverModel } from '../db/models/receiver-model';
class ReceiverService {
    constructor(receiverModel) {
        this.receiverModel = receiverModel;
    }
    async addReceiver(receiverInfo) {
        // 더 필요한 부분이 있을 수도 있음...
        // db에 저장
        const createdNewReceiver = await this.receiverModel.create(
            receiverInfo,
        );

        return createdNewReceiver;
    }

    async findReceiver(receiverId) {
        const receiver = await this.receiverModel.findById(receiverId);
        return receiver;
    }

    async deleteReceiver(receiverId) {
        const deletedReceiver = await this.receiverModel.deleteById(receiverId);
        return deletedReceiver;
    }
    async updateReceiver(receiverId, update) {
        const updatedReceiver = await this.receiverModel.updateById(
            receiverId,
            update,
        );
        return updatedReceiver;
    }
    // 더 필요한 부분있으면 추가로 작성
    async findReceiversForOneUser(userId) {
        const foundReceivers = await this.receiverModel.findReceiversByUserId(
            userId,
        );
        return foundReceivers;
    }
}

const receiverService = new ReceiverService(receiverModel);

export { receiverService };
