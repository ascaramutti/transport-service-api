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

orderRoutes.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("client")
            .populate("driver")
            .populate("vehicle");

        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

orderRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id)
            .populate("client")
            .populate("driver")
            .populate("vehicle");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

orderRoutes.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    try {
        const orders = await Order.find({ status: status })
            .populate("client")
            .populate("driver")
            .populate("vehicle");

        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

orderRoutes.put("/:id", async (req, res) => {
    try {
        const { origin, destination, cargo } = req.body;
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending order can be modified" });
        }

        if (origin) {
            order.origin = origin;
        }

        if (destination) {
            order.destination = destination;
        }

        if (cargo) {
            if (cargo.weight !== undefined) order.cargo.weight = cargo.weight;
            if (cargo.volume !== undefined) order.cargo.volume = cargo.volume;
            if (cargo.description !== undefined) order.cargo.description = cargo.description;
        }

        const updatedORder = await order.save();
        res.status(200).json(updatedORder);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default orderRoutes;