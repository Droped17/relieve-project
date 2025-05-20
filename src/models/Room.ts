import mongoose, { Schema, Document, Types } from 'mongoose';

enum ERoomStatus {
    EMPTY = "EMPTY",
    FULL = "FULL",
    NULL_VALUE = "NULL_VALUE"
}

export interface IRoom extends Document {
    /* [TODO]: Add Public Id for Room */
    // publicId: string;
    number: string;
    detail: string[];
    price: number;
    floor: number;
    image: string[];
    personPerRoom: number;
    availabilityStatus: string
    status: ERoomStatus;

    booking: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const RoomSchema: Schema = new Schema({
    number: { type: String, required: true, unique: true  },
    detail: { type: [String], required: true },
    price: { type: Number, required: true},
    floor: { type: Number, required: true },
    image: { type: [String], required: true },
    personPerRoom: {type: Number, required: true},
    availabilityStatus: {type: String},
    status: { type: String, enum: Object.values(ERoomStatus), default: ERoomStatus.EMPTY },

    booking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }]
},
    {
        timestamps: true
    });

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
