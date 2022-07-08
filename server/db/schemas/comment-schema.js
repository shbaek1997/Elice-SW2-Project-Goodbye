import { Schema } from 'mongoose';

const CommentSchema = new Schema(
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
