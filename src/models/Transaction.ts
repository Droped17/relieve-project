import mongoose, { Schema, Document, Types } from 'mongoose';

enum ETransactionStatus {
    PENDING = "pending",
    PAID = "paid",
    NOT_PAID = "not_paid"
}

export interface ITransaction extends Document {
    totalPrice: number;
    request: string;
    image: string
    status: ETransactionStatus;
    createdAt: Date;
    updatedAt: Date;

    //Reference Model
    user: Types.ObjectId[]
}

const TransactionSchema: Schema = new Schema({
    status: {type: String, enum: Object.values(ETransactionStatus), default: ETransactionStatus.PENDING, required: true },
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
},
    {
        timestamps: true
    });

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
