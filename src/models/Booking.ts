import mongoose, { Schema, Document, Types } from 'mongoose';

export enum EBookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}

export interface IBooking extends Document {
    // status: EBookingStatus;
    createdAt: Date;
    updatedAt: Date;
    request?: string;

    //Reference Model
    user: Types.ObjectId
    transaction: Types.ObjectId
    room: Types.ObjectId;
    date: string;
    nights: number;
    numberOfPeople: number;
    guest?: {
        firstName: string
        lastName: string
        email: string
        phone: string
    }
}

const BookingSchema: Schema = new Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: String, required: true },
    nights: {type: Number, required: true},
    numberOfPeople: { type: Number, required: true },
    request: { type: String },
    guest: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: Object.values(EBookingStatus),
        default: EBookingStatus.PENDING,
        required: true
    },

},
    {
        timestamps: true
    });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
