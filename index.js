import express from "express";
import cors from "cors";
import { connectToDatabase } from "./dbConfig.js";
import menuRoutes from "./Routes/menuRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import tableRoutes from "./Routes/tableRoutes.js";
import reservationRoutes from "./Routes/reservationRoutes.js";
import inventoryRoutes from "./Routes/inventoryRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/admin", reportRoutes);

app.get("/", (req, res) => {
    res.send("Restaurant Management System API");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});