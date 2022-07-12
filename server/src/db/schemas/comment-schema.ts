import { Schema } from 'mongoose';

export interface IComment {
    writer: string;
    title: String;
    content: String;
    password: String;
}

const CommentSchema: Schema<IComment> = new Schema(
    {
        writer: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'comments',
        timestamps: false,
    },
);

export { CommentSchema };
