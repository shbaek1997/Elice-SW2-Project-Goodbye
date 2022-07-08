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
        wills: [
            {
                type: WillSchema,
                required: false,
            },
        ],
        receivers: [
            {
                type: ReceiverSchema,
                required: false,
            },
        ],
    },
    {
        collection: 'users',
        timestamps: true,
    },
);

export { UserSchema };
