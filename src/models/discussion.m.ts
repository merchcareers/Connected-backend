import mongoose, { Schema, Document } from "mongoose";


interface IDiscussion extends Document {
    title: string;
    description: string;
    createdBy: mongoose.Types.ObjectId; // Mentor
    members: mongoose.Types.ObjectId[];
    comments: {
        userId: mongoose.Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];
    createdAt: Date;
}

const DiscussionSchema: Schema<IDiscussion> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export const Discussion = mongoose.model<IDiscussion>("Discussion", DiscussionSchema);