import express from "express";
import { Driver } from "../models/drivers.js";
import { Order } from "../models/orders.js";
import { Vehicle } from "../models/vehicles.js";

const driversRoutes = express.Router();

driversRoutes.get("/", async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

driversRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await Driver.findById(id);
        if (!driver) {
            return res.status(404).json({ "error": "No such driver exists" });
        }
        res.status(200).json(driver);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

driversRoutes.post("/", async (req, res) => {
    try {
        const driver = new Driver(req.body);
        const saveDoc = await driver.save();

        const pendingOrder = await Order.findOne({ status: "pending" }).sort({ createdAd: 1 });
        const availableVehicle = await Vehicle.findOne({ status: "available" });

        if (pendingOrder && availableVehicle) {
            pendingOrder.vehicle = availableVehicle._id;
            pendingOrder.driver = saveDoc._id;
            pendingOrder.status = "in_progress";
            await pendingOrder.save();

            availableVehicle.status = "in_service";
            await availableVehicle.save();
            driver.availability = false;
            await driver.save();
        }

        res.status(201).json(saveDoc);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default driversRoutes;