import express from "express";
const router = express.Router();
import {
    addInventoryItem,
    getInventory,
    updateInventory,
    getStockAlerts
} from "../Controllers/inventoryController.js";

router.post("/add", addInventoryItem);
router.get("/", getInventory);
router.put("/:id", updateInventory);
router.get("/alerts", getStockAlerts);

export default router;