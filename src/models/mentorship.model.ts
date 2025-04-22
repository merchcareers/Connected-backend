import mongoose, { Document, Schema } from "mongoose";

// interfaces/IActivity.ts
export interface IActivity extends Document {
    userId: mongoose.Types.ObjectId;
    actionType: string;
    description: string;
    createdAt: Date;
}

// models/activity.model.ts
const ActivitySchema: Schema<IActivity> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionType: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export { Activity };