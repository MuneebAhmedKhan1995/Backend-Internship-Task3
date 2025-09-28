import express from "express";
const router = express.Router();
import {
    makeReservation,
    getReservations,
    updateReservation
} from "../Controllers/reservationController.js";

router.post("/make", makeReservation);
router.get("/", getReservations);
router.put("/:id", updateReservation);

export default router;