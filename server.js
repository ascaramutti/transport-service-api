import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import driversRoutes from "./routes/driversRoutes.js";
import vehiclesRoutes from "./routes/vehicleRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

connectDB();

app.use("/api/clients", clientsRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/vehicles", vehiclesRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is up and listening on port ${port}`);
})