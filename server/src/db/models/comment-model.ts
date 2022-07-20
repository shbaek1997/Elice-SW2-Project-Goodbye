import { Model, model, Types } from 'mongoose';
import { CommentSchema, IComment } from '../schemas/comment-schema';

export interface ResComment extends IComment {
    _id: Types.ObjectId;
}

export interface IUpdateComment {
    writer?: string;
    title?: string;
    content?: string;
}

export class CommentModel {
    Comment: Model<IComment>;

    constructor() {
        this.Comment = model<IComment>('comments', CommentSchema);
    }

    // 새 추모글 생성
    create(commentInfo: IComment): Promise<ResComment> {
        const createdNewComment = this.Comment.create(commentInfo);

        return createdNewComment;
    }

    // objectId를 이용해 특정 추모글 조회
    async findById(commentId: string): Promise<ResComment> {
        const comment = await this.Comment.findOne({
            _id: commentId,
        });
        if (!comment) {
            throw new Error(
                '해당 추모글이 존재하지 않습니다. 다시 확인해주세요.',
            );
        }

        return comment;
    }

    // 추모글 수정
    async update(
        commentId: string,
        update: IUpdateComment,
    ): Promise<ResComment> {
        const filter = { _id: commentId };
        const option = { returnOriginal: false };

        const updatedComment = await this.Comment.findOneAndUpdate(
            filter,
            update,
            option,
        );
        if (!updatedComment) {
            throw new Error('추모글 수정에 실패했습니다.');
        }

        return updatedComment;
    }

    // 추모글 삭제
    async delete(commentId: string): Promise<ResComment> {
        const filter = { _id: commentId };

        const deletedComment = await this.Comment.findOneAndDelete(filter);
        if (!deletedComment) {
            throw new Error('추모글 삭제에 실패했습니다.');
        }

        return deletedComment;
    }
}

const commentModel = new CommentModel();

export { commentModel };
