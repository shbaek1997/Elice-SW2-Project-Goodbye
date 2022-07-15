import { Schema } from 'mongoose';

interface InterfaceWill {
    title: string;
    content: string;
    userId: string;
    receivers: string[];
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
            type: [String],
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
