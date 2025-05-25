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
    checkIn: string;
    checkOut: string;
    nights: number;
    personPerRoom: number;
    guest?: {
        firstName: string
        lastName: string
        email: string
        phone: string
    }
    checkedInAt?: Date;
    checkedOutAt?: Date;
}

const BookingSchema: Schema = new Schema({
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number },
    personPerRoom: { type: Number, required: true },
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
    checkedInAt: { type: Date },
    checkedOutAt: { type: Date },

    /* Reference Model */
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
},
    {
        timestamps: true
    });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
