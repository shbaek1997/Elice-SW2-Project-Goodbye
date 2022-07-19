// user Schema
import { Schema } from 'mongoose';
import { InterfaceUserTrust, UserTrustSchema } from './user-trust-schema';
interface InterfaceUser {
    email: string;
    fullName: string;
    password: string;
    dateOfBirth: string;
    photo?: string;
    wills?: string[];
    receivers?: string[];
    trustedUser?: InterfaceUserTrust;
    managedUsers?: InterfaceUserTrust[];
}

interface InterfaceUserResult extends InterfaceUser {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface InterfaceUserInfoRequired {
    userId: string;
    currentPassword: string;
}

const UserSchema = new Schema<InterfaceUser>(
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
        // will과 receivers 둘다 id만 담는 것이 효율적일까?
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
        trustedUser: { 
            type: UserTrustSchema,
            required: false,
        },
        managedUsers: { 
            type: [UserTrustSchema],
            required: false,
            default: [],
        },
    },
    {
        collection: 'users',
        timestamps: true,
    },
);

export type { InterfaceUser, InterfaceUserResult, InterfaceUserInfoRequired };
export { UserSchema };
