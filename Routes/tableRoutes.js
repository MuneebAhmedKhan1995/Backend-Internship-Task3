import express from "express";
const router = express.Router();
import {
    addTable,
    getTables,
    checkTableAvailability,
    updateTableStatus
} from "../Controllers/tableController.js";

router.post("/add", addTable);
router.get("/", getTables);
router.get("/availability", checkTableAvailability);
router.put("/:id/status", updateTableStatus);

export default router;