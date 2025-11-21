import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

export const Client = mongoose.model("Client", clientSchema);