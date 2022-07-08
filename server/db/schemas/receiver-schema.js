//user Schema
import { Schema } from 'mongoose';
const ReceiverSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        emailAddress: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
        },
        relation: {
            type: String,
            required: true,
        },
        // role이 필요할까?
        role: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'receivers',
        timestamps: true,
    },
);

export { ReceiverSchema };
