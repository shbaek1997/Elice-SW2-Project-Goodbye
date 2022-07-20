import { Schema } from 'mongoose';

interface InterfaceReceiver {
    fullName: string;
    emailAddress: string;
    userId: string;
    relation: string;
}
const ReceiverSchema = new Schema<InterfaceReceiver>(
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
    },
    {
        collection: 'receivers',
        timestamps: true,
    },
);

export type { InterfaceReceiver };
export { ReceiverSchema };
