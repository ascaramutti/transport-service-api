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

orderRoutes.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending order can be deleted" });
        }

        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: "Order deleted succesfuly" });
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

orderRoutes.put("/:id/complete", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate("vehicle")
            .populate("driver");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "in_progress") {
            return res.status(400).json({ error: "Only in-progress orders can be completed" });
        }

        order.status = "completed";
        await order.save();

        const vehicle = await Vehicle.findById(order.vehicle._id);
        const driver = await Driver.findById(order.driver._id);

        if (vehicle) {
            vehicle.status = "available";
            await vehicle.save();
        }

        if (driver) {
            driver.availability = true;
            await driver.save();
        }

        const pendingOrder = await Order.findOne({ status: "pending" }).sort({ createdAt: 1 });

        if(pendingOrder && vehicle && driver) {
            pendingOrder.vehicle = vehicle._id;
            pendingOrder.driver = driver._id;
            pendingOrder.status = "in_progress";
            await pendingOrder.save();

            vehicle.status = "in_service";
            await vehicle.save();
            driver.availability = false;
            await driver.save();
        }

        res.status(200).json({
            message: "Order completed successfuly",
            completedORder: order
        });
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default orderRoutes;