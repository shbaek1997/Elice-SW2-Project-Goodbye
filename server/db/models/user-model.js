import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    async findById(userId) {
        const user = await User.findOne({ _id: userId });
        return user;
    }

    async create(userInfo) {
        const createdNewUser = await User.create(userInfo);
        return createdNewUser;
    }

    async updateById({ userId, update }) {
        const filter = { _id: userId };
        const option = { returnOriginal: false };

        const updatedUser = await User.findOneAndUpdate(filter, update, option);
        return updatedUser;
    }

    async deleteById(userId) {
        const deletedUser = await User.findOneAndDelete({ _id: userId });
        return deletedUser;
    }

    //관련된 user의 will 추가, 수정, 삭제
    async addWill(userId, willId) {
        console.log('userId: ' + userId + 'willData: ' + willId);
        const willAddedUser = await User.updateOne(
            { _id: userId },
            { $push: { wills: willId } },
        );
        return willAddedUser;
    }

    async deleteWill(userId, willId) {
        console.log('userId: ' + userId + 'willData: ' + willId);
        const willDeletedUser = await User.updateOne(
            { _id: userId },
            { $pull: { wills: willId } },
        );
        return willDeletedUser;
    }
    //관련된 user의 receiver 추가, 수정, 삭제
    async addReceiver(userId, receiverId) {
        const receiverAddedUser = await User.updateOne(
            { _id: userId },
            { $push: { receivers: receiverId } },
        );
        return receiverAddedUser;
    }
    async deleteReceiver(userId, receiverId) {
        const receiverDeletedUser = await User.updateOne(
            { _id: userId },
            { $pull: { receivers: receiverId } },
        );
        return receiverDeletedUser;
    }
}

const userModel = new UserModel();

export { userModel };
