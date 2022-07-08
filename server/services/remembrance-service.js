import bcrypt from 'bcrypt';
import { remembranceModel } from '../db';
import { userService } from './user-service';

class RemembranceService {
    constructor() {
        this.remembranceModel = remembranceModel;
    }

    // 새 추모 생성
    async addRemembrance(userId, remembranceInfo) {
        // 추모 대상자 확인을 위해 유저 정보 조회
        const user = await userService.getUser(userId);

        const newInfo = {
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            ...(user.photo && { photo: user.photo }),
            ...remembranceInfo,
        };

        const createdNewRemembrance = await this.remembranceModel.create(
            newInfo,
        );

        return createdNewRemembrance;
    }

    // 최근 업데이트 추모 조회
    async getRecentRemembrances(count) {
        const remembrances = await this.remembranceModel.findRecent(count);

        return remembrances;
    }

    // 특정 추모 조회
    async getRemembranceById(remembranceId) {
        const remembrance = await this.remembranceModel.findById(remembranceId);
        if (!remembrance) {
            throw new Error(
                '해당 추모는 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return remembrance;
    }

    // 특정 추모글 조회
    async getCommentById(remembranceId, commentId) {
        const comment = await this.remembranceModel.findCommentById(
            remembranceId,
            commentId,
        );
        if (!comment) {
            throw new Error(
                '해당 추모 글은 존재하지 않습니다. 다시 확인해 주세요.',
            );
        }

        return comment;
    }

    // 추모 수정
    async setRemembrance(remembranceId, update) {
        const remembrance = await this.remembranceModel.update(
            remembranceId,
            update,
        );

        return remembrance;
    }

    // 추모글 추가
    async addComment(remembranceId, commentInfo) {
        const hashedPassword = await bcrypt.hash(commentInfo.password, 10);

        const newInfo = {
            ...commentInfo,
            password: hashedPassword,
        };

        const comment = await this.remembranceModel.createComment(
            remembranceId,
            newInfo,
        );

        return comment;
    }

    // 추모글 수정
    async setCommet(remembranceId, commentId, currentPassword, update) {
        // 작성자 확인을 위해 해당 추모글의 비밀번호 조회
        const remembrance = await this.remembranceModel.findCommentById(
            remembranceId,
            commentId,
        );
        const hashedPassword = remembrance.comments[0].password;

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            hashedPassword,
        );
        if (!isPasswordCorrect) {
            throw new Error(
                '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
            );
        }

        const newInfo = { ...update, password: hashedPassword };
        const updatedRemembrance = await this.remembranceModel.updateComment(
            remembranceId,
            commentId,
            newInfo,
        );

        return updatedRemembrance;
    }

    // 추모글 삭제
    async deleteComment(remembranceId, commentId, currentPassword) {
        // 작성자 확인을 위해 해당 추모글의 비밀번호 조회
        const remembrance = await this.remembranceModel.findCommentById(
            remembranceId,
            commentId,
        );
        const hashedPassword = remembrance.comments[0].password;

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            hashedPassword,
        );
        if (!isPasswordCorrect) {
            throw new Error(
                '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
            );
        }

        const deletedRemembrance = await this.remembranceModel.deleteComment(
            remembranceId,
            commentId,
        );

        return deletedRemembrance;
    }
}

const remembranceService = new RemembranceService();

export { remembranceService };
