import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import clientsRoutes from "./routes/clientsRoutes.js";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

connectDB();

app.use("/api/clients", clientsRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is up and listening on port ${port}`);
})