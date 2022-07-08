import { willModel } from '../db/models/will-model';
class WillService {
    constructor(willModel) {
        this.willModel = willModel;
    }
    async addWill(willInfo) {
        // 더 필요한 부분이 있을 수도 있음...
        // db에 저장
        const createdNewWill = await this.willModel.create(willInfo);

        return createdNewWill;
    }

    async findWill(willId) {
        const will = await this.willModel.findById(willId);
        return will;
    }

    async deleteWill(willId) {
        const deletedWill = await this.willModel.deleteById(willId);
        return deletedWill;
    }
    async updateWill(willId, update) {
        const updatedWill = await this.willModel.updateById(willId, update);
        return updatedWill;
    }
    // 더 필요한 부분있으면 추가로 작성
    async findWillsForOneUser(userId) {
        const foundWills = await this.willModel.findWillsByUserId(userId);
        return foundWills;
    }
}

const willService = new WillService(willModel);

export { willService };
