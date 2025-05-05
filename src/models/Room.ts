import mongoose, { Schema, Document } from 'mongoose';

enum ERoomStatus {
    EMPTY = "empty",
    FULL = "full",
    NULL = "null_value"
}

export interface IRoom extends Document {
    number: string;
    detail: string[];
    price: number;
    floor: number;
    image: string[];
    status: ERoomStatus;
    createdAt: Date;
    updatedAt: Date;

    // USER
}

const RoomSchema: Schema = new Schema({
    number: { type: String, required: true, unique: true  },
    detail: { type: [String], required: true },
    price: { type: Number, required: true},
    floor: { type: Number, required: true },
    image: { type: [String], required: true },
    status: { type: String, enum: Object.values(ERoomStatus), default: ERoomStatus.NULL, required: true },
},
    {
        timestamps: true
    });

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
