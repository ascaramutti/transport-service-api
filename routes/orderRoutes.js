import express from "express";
import { Order } from "../models/orders.js";
import { Client } from "../models/clients.js";
import { Vehicle } from "../models/vehicles.js";
import { Driver } from "../models/drivers.js";

const orderRoutes = express.Router();

orderRoutes.post("/", async (req, res) => {
    try {
        const { client, origin, destination, cargo } = req.body;

        const clientExists = await Client.findById(client);
        if (!clientExists) {
            return res.status(400).json({ error: "Client not found" });
        }

        const order = new Order({ client, origin, destination, cargo });

        const availableVehicle = await Vehicle.findOne({ status: "available" });
        const availableDriver = await Driver.findOne({ availability: true });

        if (availableDriver && availableVehicle) {
            order.vehicle = availableVehicle._id;
            order.driver = availableDriver._id;
            order.status = "in_progress";

            availableVehicle.status = "in_service";
            await availableVehicle.save();
            availableDriver.availability = false;
            await availableDriver.save();
        }

        const saveOrder = await order.save();
        res.status(201).json(saveOrder);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default orderRoutes;