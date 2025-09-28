import express from "express";
const router = express.Router();
import {
    getDailySales,
    getPopularItems,
    getTableOccupancy
} from "../Controllers/reportController.js";

router.get("/sales/daily", getDailySales);
router.get("/popular-items", getPopularItems);
router.get("/table-occupancy", getTableOccupancy);

export default router;