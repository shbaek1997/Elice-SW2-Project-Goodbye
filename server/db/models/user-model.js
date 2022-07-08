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
    // find All이 필요한가?
    // async findAll() {
    //     const users = await User.find({});
    //     return users;
    // }

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
    //관련된 user의 receiver 추가, 수정, 삭제
}

const userModel = new UserModel();

export { userModel };
