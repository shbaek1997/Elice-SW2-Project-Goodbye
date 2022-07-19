import { Schema, Types } from 'mongoose';

export interface IRemembrance {
    userId: string;
    fullName: string;
    dateOfBirth: string;
    dateOfDeath?: string;
    isPublic?: boolean;
    photo?: string;
    comments?: Array<Types.ObjectId>;
}

const RemembranceSchema: Schema<IRemembrance> = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        dateOfDeath: {
            type: String,
            required: false,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        photo: {
            type: String,
            required: false,
        },
        comments: {
            type: [Types.ObjectId],
            ref: 'comments',
            required: false,
        },
    },
    {
        collection: 'remembrances',
        timestamps: true,
    },
);

export { RemembranceSchema };
