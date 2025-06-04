import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
    title: string;
    description: string;
    dateTime: Date;
    location?: string; // Optional, for virtual or physical events
    createdBy: mongoose.Types.ObjectId; // Mentor or admin
    attendees: mongoose.Types.ObjectId[]; // Students or other users
    createdAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

export const Event = mongoose.model<IEvent>("Event", EventSchema);