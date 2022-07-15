import { model, Model } from 'mongoose';
import type { InterfaceUser } from '../schemas/user-schema';
import { UserSchema } from '../schemas/user-schema';

export class UserModel {
    User: Model<InterfaceUser>;

    constructor() {
        this.User = model<InterfaceUser>('users', UserSchema);
    }
    // this.User를 쓰면 Property User does not exist on type UserModel이라고 뜸..

    async findByEmail(email: string) {
        const user = await this.User.findOne({ email });
        return user;
    }

    async findById(userId: string) {
        const user = await this.User.findOne({ _id: userId });
        return user;
    }

    async create(userInfo: InterfaceUser) {
        const createdNewUser = await this.User.create(userInfo);
        return createdNewUser;
    }

    async updateById(userId: string, update: InterfaceUser) {
        const filter = { _id: userId };
        const option = { returnOriginal: false };

        const updatedUser = await this.User.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedUser;
    }

    async deleteById(userId: string) {
        const deletedUser = await this.User.findOneAndDelete({ _id: userId });
        return deletedUser;
    }

    // 관련된 user의 will 추가, 수정, 삭제
    async addWill(userId: string, willId: string) {
        const willAddedUser = await this.User.updateOne(
            { _id: userId },
            { $push: { wills: willId } },
        );
        return willAddedUser;
    }

    async deleteWill(userId: string, willId: string) {
        const willDeletedUser = await this.User.updateOne(
            { _id: userId },
            { $pull: { wills: willId } },
        );
        return willDeletedUser;
    }

    // 관련된 user의 receiver 추가, 수정, 삭제
    async addReceiver(userId: string, receiverId: string) {
        const receiverAddedUser = await this.User.updateOne(
            { _id: userId },
            { $push: { receivers: receiverId } },
        );
        return receiverAddedUser;
    }

    async deleteReceiver(userId: string, receiverId: string) {
        const receiverDeletedUser = await this.User.updateOne(
            { _id: userId },
            { $pull: { receivers: receiverId } },
        );
        return receiverDeletedUser;
    }
}

const userModel = new UserModel();

export { userModel };
