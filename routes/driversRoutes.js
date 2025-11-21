import express from "express";
import { Driver } from "../models/drivers.js";

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
        res.status(201).json(saveDoc);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default driversRoutes;