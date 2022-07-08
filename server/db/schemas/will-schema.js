//user Schema
import { Schema } from 'mongoose';
import { ReceiverSchema } from './receiver-schema';
const WillSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        //userId가 필요한가? 어차피 유저 DB안에 들어감
        receivers: [
            {
                type: ReceiverSchema,
                required: true,
            },
        ],
    },
    {
        collection: 'wills',
        timestamps: true,
    },
);

export { WillSchema };
