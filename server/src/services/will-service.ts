import { willModel, WillModel } from '../db/models/will-model';
import type { InterfaceWill } from '../db/schemas/will-schema';
class WillService {
    willModel: WillModel;

    constructor(willModel: WillModel) {
        this.willModel = willModel;
    }

    async addWill(willInfo: InterfaceWill): Promise<any> {
        // 더 필요한 부분이 있을 수도 있음...
        // db에 저장
        const createdNewWill = await this.willModel.create(willInfo);

        return createdNewWill;
    }

    async findWill(willId: string) {
        const will = await this.willModel.findById(willId);
        return will;
    }

    async deleteWill(willId: string) {
        const deletedWill = await this.willModel.deleteById(willId);
        return deletedWill;
    }

    async updateWill(willId: string, update: any) {
        const updatedWill = await this.willModel.updateById(willId, update);
        return updatedWill;
    }

    // 더 필요한 부분있으면 추가로 작성
    async findWillsForOneUser(userId: string) {
        const foundWills = await this.willModel.findWillsByUserId(userId);
        return foundWills;
    }
}

const willService = new WillService(willModel);

export { willService };
