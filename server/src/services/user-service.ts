import bcrypt from 'bcrypt';
import { UserModel, userModel } from '../db/models/user-model';
import type { InterfaceUserInfoRequired } from '../db/schemas/user-schema';
import { ImageService } from './image-service';

class UserService {
    // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
    userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    // 회원가입
    async addUser(userInfo: any) {
        // 객체 destructuring
        const { email, fullName, password, repeatPassword, dateOfBirth } =
            userInfo;

        // 이메일 중복 확인
        const user = await this.userModel.findByEmail(email);
        if (user) {
            throw new Error(
                '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
            );
        }

        // 이메일 중복은 이제 아님

        // 비밀번호 일치여부 확인..
        const isPasswordSame = password === repeatPassword;
        if (!isPasswordSame) {
            throw new Error(' 비밀번호가 일치하지 않습니다.');
        }

        // 우선 비밀번호 해쉬화(암호화)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserInfo = {
            fullName,
            email,
            password: hashedPassword,
            dateOfBirth,
        };

        // db에 저장
        const createdNewUser = await this.userModel.create(newUserInfo);

        return createdNewUser;
    }

    async getUser(userId: string) {
        const user = await this.userModel.findById(userId);
        return user;
    }

    async setManagedUsers(userId: string, managedUser: any) {
        const user = await this.userModel.findById(userId);
        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }

        await this.userModel.addManagedUser(userId, managedUser);
        const updatedUser = await this.userModel.findById(userId);
        return updatedUser;
    }

    async removeManagedUsers(userId: string, managedUserId: string) {
        const user = await this.userModel.findById(userId);
        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }

        await this.userModel.removeManagedUser(userId, managedUserId);
        const updatedUser = await this.userModel.findById(userId);
        return updatedUser;
    }

    async confirmManagedUsers(userId: string, toUpdate: any) {
        // 우선 해당 id의 유저가 db에 있는지 확인
        let user = await this.userModel.findById(userId);

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }
        // 업데이트 진행
        user = await this.userModel.updateById(userId, toUpdate);
        return user;
    }

    // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
    async setUser(userInfoRequired: InterfaceUserInfoRequired, toUpdate: any) {
        // 객체 destructuring
        const { userId, currentPassword } = userInfoRequired;

        // 우선 해당 id의 유저가 db에 있는지 확인
        let user = await this.userModel.findById(userId);

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }

        // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

        // 비밀번호 일치 여부 확인
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            correctPasswordHash,
        );

        if (!isPasswordCorrect) {
            throw new Error(
                '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
            );
        }

        // 이제 드디어 업데이트 시작

        // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
        const { password } = toUpdate;

        if (password) {
            const newPasswordHash = await bcrypt.hash(password, 10);
            toUpdate.password = newPasswordHash;
        }

        // 이미지 변경하는 경우 기존 이미지 삭제 후 새 이미지 저장
        const { photo } = toUpdate;
        if (photo && user.photo) {
            ImageService.deleteImage(user.photo);
        }

        // 업데이트 진행
        user = await this.userModel.updateById(userId, toUpdate);
        return user;
    }

    async deleteUser(userInfoRequired: InterfaceUserInfoRequired) {
        // 객체 destructuring
        const { userId, currentPassword } = userInfoRequired;
        // 우선 해당 id의 유저가 db에 있는지 확인
        const user = await this.userModel.findById(userId);

        // db에서 찾지 못한 경우, 에러 메시지 반환
        if (!user) {
            throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }

        // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

        // 비밀번호 일치 여부 확인
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            correctPasswordHash,
        );

        if (!isPasswordCorrect) {
            throw new Error(
                '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
            );
        }

        // 저장된 이미지가 있는 경우 s3에서도 삭제
        if (user.photo) {
            ImageService.deleteImage(user.photo);
        }

        // 삭제 진행
        const deletedUser = await this.userModel.deleteById(userId);
        return deletedUser;
    }

    async addWill(userId: string, willId: string) {
        const updatedUser = await this.userModel.addWill(userId, willId);
        return updatedUser;
    }

    async deleteWill(userId: string, willId: string) {
        const updatedUser = await this.userModel.deleteWill(userId, willId);
        return updatedUser;
    }

    async addReceiver(userId: string, receiverId: string) {
        const updatedUser = await this.userModel.addReceiver(
            userId,
            receiverId,
        );
        return updatedUser;
    }

    async deleteReceiver(userId: string, receiverId: string) {
        const updatedUser = await this.userModel.deleteReceiver(
            userId,
            receiverId,
        );
        return updatedUser;
    }
}

const userService = new UserService(userModel);

export { userService };
