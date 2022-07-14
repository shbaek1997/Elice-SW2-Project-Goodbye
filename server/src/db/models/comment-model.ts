import { Model, model } from 'mongoose';
import { CommentSchema, IComment } from '../schemas/comment-schema';

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
    async create(commentInfo: IComment) {
        const createdNewComment = await this.Comment.create(commentInfo);

        return createdNewComment;
    }

    // objectId를 이용해 특정 추모글 조회
    async findById(commentId: string) {
        const comment = await this.Comment.findOne({
            _id: commentId,
        });

        return comment;
    }

    // 추모글 수정
    async update(commentId: string, update: IUpdateComment) {
        const filter = { _id: commentId };
        const option = { returnOriginal: false };

        const updatedComment = await this.Comment.findOneAndUpdate(
            filter,
            update,
            option,
        );

        return updatedComment;
    }

    // 추모글 삭제
    async delete(commentId: string) {
        const filter = { _id: commentId };

        const deletedComment = await this.Comment.findOneAndDelete(filter);

        return deletedComment;
    }
}

const commentModel = new CommentModel();

export { commentModel };
