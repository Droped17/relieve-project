import mongoose, { Schema, Document, Types } from 'mongoose';

enum EBookingStatus {
    CHECK_IN = "checkin",
    CHECK_OUT = "checkout",
    NULL = "null",
    CANCELLED = "CANCELLED"
}

export interface IBooking extends Document {
    status: EBookingStatus;
    createdAt: Date;
    updatedAt: Date;

    //Reference Model
    user: Types.ObjectId[]
    transaction: Types.ObjectId[]
    room: Types.ObjectId;            
    dateEnd: Date;                   
    numberOfPeople: number; 
}

const BookingSchema: Schema = new Schema({
    status: { type: String, enum: Object.values(EBookingStatus), default: EBookingStatus.NULL },
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    transaction: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
},
    {
        timestamps: true
    });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
