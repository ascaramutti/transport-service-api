import express from "express";
import { Vehicle } from "../models/vehicles.js";
import { Order } from "../models/orders.js";
import { Driver } from "../models/drivers.js";

const vehiclesRoutes = express.Router();

vehiclesRoutes.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

vehiclesRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ "error": "No such vehicle exists" });
        }
        res.status(200).json(vehicle);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

vehiclesRoutes.post("/", async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        const saveDoc = await vehicle.save();

        const pendingOrder = await Order.findOne({ status: "pending" }).sort({ createAt: 1 });
        const availableDriver = await Driver.findOne({ availability: true });

        if (pendingOrder && availableDriver) {
            pendingOrder.vehicle = saveDoc._id;
            pendingOrder.driver = availableDriver._id;
            pendingOrder.status = "in_progress";
            await pendingOrder.save();

            vehicle.status = "in_service";
            await vehicle.save();
            availableDriver.availability = false;
            await availableDriver.save();
        }

        res.status(201).json(saveDoc);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default vehiclesRoutes;