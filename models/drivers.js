import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export const Driver = mongoose.model("Driver", driverSchema);