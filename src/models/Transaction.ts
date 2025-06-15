import mongoose, { Schema, Document, Types } from 'mongoose';

enum ETransactionStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    NOT_PAID = "NOT_PAID",
}

export interface ITransaction extends Document {
    totalPrice: number;
    image?: string
    checkIn: string;
    checkOut: string;
    checkedInAt?: Date;
    checkedOutAt?: Date;
    status: ETransactionStatus;
    createdAt: Date;
    updatedAt: Date;

    //Reference Model
    user: Types.ObjectId[]
    booking: Types.ObjectId[]
    room: Types.ObjectId[]
}

const TransactionSchema: Schema = new Schema({
    totalPrice: { type: Number, required: true },
    image: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    checkedInAt: { type: Date, default: null},
    checkedOutAt: { type: Date, default: null },
    status: { type: String, enum: Object.values(ETransactionStatus), default: ETransactionStatus.PENDING, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    booking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'}
}, {
    timestamps: true
});
export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
