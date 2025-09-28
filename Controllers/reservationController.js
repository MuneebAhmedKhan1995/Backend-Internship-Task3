import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const reservationsCollection=mydb.collection("reservations")


export const makeReservation = async (req, res) => {
    try {
        const { customerName, phone, email, tableNumber, reservationDate, reservationTime, partySize, specialRequests } = req.body;

        const reservation = {
            customerName,
            phone,
            email: email || "",
            tableNumber: parseInt(tableNumber),
            reservationDate,
            reservationTime,
            partySize: parseInt(partySize),
            specialRequests: specialRequests || "",
            status: "confirmed",
            createdAt: new Date()
        };

       
        const tablesCollection = getDb().collection("tables");
        const table = await tablesCollection().findOne({ 
            tableNumber: parseInt(tableNumber) 
        });

        if (!table || !table.available) {
            return res.status(400).json({ error: "Table not available" });
        }
        const conflictingReservation = await reservationsCollection().findOne({
            tableNumber: parseInt(tableNumber),
            reservationDate: reservationDate,
            reservationTime: reservationTime,
            status: { $in: ["confirmed", "pending"] }
        });

        if (conflictingReservation) {
            return res.status(400).json({ error: "Table already reserved for this time" });
        }

        const response = await reservationsCollection().insertOne(reservation);
        
        res.status(201).json({ 
            message: "Reservation made successfully", 
            reservationId: response.insertedId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReservations = async (req, res) => {
    try {
        const { date, status } = req.query;
        let query = {};
        
        if (date) query.reservationDate = date;
        if (status) query.status = status;

        const reservations = await reservationsCollection().find(query).sort({ reservationDate: 1, reservationTime: 1 }).toArray();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const reservationId = new ObjectId(req.params.id);
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await reservationsCollection().updateOne(
            { _id: reservationId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.json({ message: "Reservation updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};