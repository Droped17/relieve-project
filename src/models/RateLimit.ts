import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    requests: [
        {
            timestamp: {type: Date, default: Date.now},
            _id: false
        }
    ]
})

RateLimitSchema.index({"requests.timestamp": 1}, {expireAfterSeconds: 60 * 60 * 24})

const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema)
export default RateLimit