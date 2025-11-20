import express from "express";
import { Client } from "../models/clients.js";
const clientsRoutes = express.Router();

clientsRoutes.get("/", async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

clientsRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ "error": "No such client exists" });
        }
        res.status(200).json(client);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

clientsRoutes.post("/", async (req, res) => {
    try {
        const client = new Client(req.body);
        const saveDoc = await client.save();
        res.status(201).json(saveDoc);
    }
    catch (err) {
        res.status(500).json({ "error": err.message });
    }
})

export default clientsRoutes;