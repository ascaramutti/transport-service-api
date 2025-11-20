import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    serviceType: String,
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargo: {
        type: new mongoose.Schema({
            weight: { type: Number, required: true },
            volume: { type: Number, required: true },
            description: { type: String }
        }, { _id: false }),
        required: true
    },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'canceled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", orderSchema);