// user Schema
import { Schema } from 'mongoose';

interface InterfaceUserTrust {
    email?: string;
    userId?: string;
    confirmed?: boolean;
}

const UserTrustSchema = new Schema<InterfaceUserTrust>(
    {
        email: {
            type: String,
            required: false,
        },
        userId: {
            type: String,
            required: false,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    },
);

export type { InterfaceUserTrust };
export { UserTrustSchema };
