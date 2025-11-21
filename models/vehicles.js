import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    plate: { type: String, required: true, unique: true },
    status: { type: String, enum: ['available', 'in_service'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
})

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);