import mongoose, { Schema, Document } from 'mongoose';

enum ERoomStatus {
    EMPTY = "empty",
    FULL = "full",
    NULL = "null"
}

export interface IRoom extends Document {
    number: string;
    detail: string;
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
    detail: { type: String, required: true },
    price: { type: Number, required: true},
    floor: { type: Number, required: true },
    image: { type: [], required: true },
    status: { type: ERoomStatus, default: ERoomStatus.EMPTY },
},
    {
        timestamps: true
    });

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
