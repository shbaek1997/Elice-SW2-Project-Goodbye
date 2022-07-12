import { receiverModel, ReceiverModel } from '../db/models/receiver-model';
import type { InterfaceReceiver } from '../db/schemas/receiver-schema';

class ReceiverService {
    receiverModel: ReceiverModel;

    constructor(receiverModel : ReceiverModel) {
        this.receiverModel = receiverModel;
    }

    async addReceiver(receiverInfo: InterfaceReceiver): Promise<any> {
        // 더 필요한 부분이 있을 수도 있음...
        // db에 저장
        const createdNewReceiver = await this.receiverModel.create(
            receiverInfo,
        );

        return createdNewReceiver;
    }

    async findReceiver(receiverId: string) {
        const receiver = await this.receiverModel.findById(receiverId);
        return receiver;
    }

    async deleteReceiver(receiverId: string) {
        const deletedReceiver = await this.receiverModel.deleteById(receiverId);
        return deletedReceiver;
    }

    async updateReceiver(receiverId: string, update: any) {
        const updatedReceiver = await this.receiverModel.updateById(
            receiverId,
            update,
        );
        return updatedReceiver;
    }

    // 더 필요한 부분있으면 추가로 작성
    async findReceiversForOneUser(userId: string) {
        const foundReceivers = await this.receiverModel.findReceiversByUserId(
            userId,
        );
        return foundReceivers;
    }
}

const receiverService = new ReceiverService(receiverModel);

export { receiverService };
