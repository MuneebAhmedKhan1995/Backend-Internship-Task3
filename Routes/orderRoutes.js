import express from "express";
const router = express.Router();
import {
    placeOrder,
    getOrders,
    updateOrderStatus
} from "../Controllers/orderController.js";

router.post("/place", placeOrder);
router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);

export default router;