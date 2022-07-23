import bcrypt from 'bcrypt';
import { IComment } from '../db/schemas/comment-schema';
import { commentModel, CommentModel, IUpdateComment, ResComment } from '../db';
import { remembranceService } from './remembrance-service';

interface IUpdateInput extends IUpdateComment {
    password: string;
}

class CommentService {
    commentModel: CommentModel;

    constructor() {
        this.commentModel = commentModel;
    }

    // 비밀번호 확인 함수
    async checkPassword(
        commentId: string,
        currentPassword: string,
    ): Promise<void> {
        // 작성자 확인을 위해 해당 추모글의 비밀번호 조회
        const comment = await this.commentModel.findById(commentId);
        const hashedPassword = comment.password;

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            hashedPassword,
        );
        if (!isPasswordCorrect) {
            throw new Error(
                '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
            );
        }
    }

    // 새 추모글 생성
    async addComment(
        remembranceId: string,
        commentInfo: IComment,
    ): Promise<ResComment> {
        // 추모 데이터에 접근 가능한지 확인 - 접근 불가능하다면 Error 발생
        await remembranceService.getRemembranceById(remembranceId);

        // 비밀번호 암호화
        const { password } = commentInfo;
        const hashedPassword = await bcrypt.hash(
            password as string,
            Number(process.env.SALT_OR_ROUNDS),
        );

        const newInfo = {
            ...commentInfo,
            password: hashedPassword,
        };

        const comment = await this.commentModel.create(newInfo);
        remembranceService.setComment(remembranceId, comment._id, 'add');

        return comment;
    }

    // 특정 추모글 조회
    getCommentById(commentId: string): Promise<ResComment> {
        const comment = this.commentModel.findById(commentId);

        return comment;
    }

    // 추모글 수정
    async setCommet(
        commentId: string,
        commentInfo: IUpdateInput,
    ): Promise<ResComment> {
        const { password, ...update } = commentInfo;

        await this.checkPassword(commentId, password);

        const updatedComment = this.commentModel.update(commentId, update);

        return updatedComment;
    }

    // 추모글 삭제
    async deleteComment(
        remembranceId: string,
        commentId: string,
        currentPassword: string,
    ): Promise<{ result: string }> {
        await this.checkPassword(commentId, currentPassword);

        const deletedComment = await this.commentModel.delete(commentId);
        remembranceService.setComment(
            remembranceId,
            deletedComment._id,
            'delete',
        );

        return { result: 'success' };
    }
}

const commentService = new CommentService();

export { commentService };
