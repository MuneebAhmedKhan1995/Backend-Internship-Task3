import express from "express";
const router = express.Router();
import {
    addMenuItem,
    getMenu,
    updateMenuItem,
    deleteMenuItem
} from "../Controllers/menuController.js";

router.post("/add", addMenuItem);
router.get("/", getMenu);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;