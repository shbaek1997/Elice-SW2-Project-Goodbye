import { Schema } from 'mongoose';

interface InterfaceWill {
    title: string;
    content: string;
    userId: string;
    receivers: any[];
}

const WillSchema = new Schema<InterfaceWill>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        receivers: {
            type: [
                {
                    receiverId: String,
                    email: String,
                    _id: false,
                },
            ],
            required: true,
        },
    },
    {
        collection: 'wills',
        timestamps: true,
    },
);
export type { InterfaceWill };
export { WillSchema };
