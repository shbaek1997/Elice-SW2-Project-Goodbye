//user Schema
import { Schema } from 'mongoose';
import { WillSchema } from './will-schema';
import { ReceiverSchema } from './receiver-schema';
const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            required: false,
        },
        //will과 receivers 둘다 id만 담는 것이 효율적일까?
        wills: {
            type: [String],
            required: false,
            default: [],
        },
        receivers: {
            type: [String],
            required: false,
            default: [],
        },
    },
    {
        collection: 'users',
        timestamps: true,
    },
);

export { UserSchema };
