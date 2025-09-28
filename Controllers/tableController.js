import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const tablesCollection=mydb.collection("tables")

export const addTable = async (req, res) => {
    try {
        const table = {
            tableNumber: req.body.tableNumber,
            capacity: req.body.capacity,
            location: req.body.location,
            available: true,
            createdAt: new Date()
        };

        const response = await tablesCollection().insertOne(table);
        res.status(201).json({ 
            message: "Table added successfully", 
            id: response.insertedId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTables = async (req, res) => {
    try {
        const { available } = req.query;
        let query = {};
        
        if (available !== undefined) query.available = available === 'true';

        const tables = await tablesCollection().find(query).toArray();
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkTableAvailability = async (req, res) => {
    try {
        const { tableNumber, date, time } = req.query;
        
        const table = await tablesCollection().findOne({ 
            tableNumber: parseInt(tableNumber) 
        });

        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        const reservationsCollection = getDb().collection("reservations");
        const conflictingReservation = await reservationsCollection.findOne({
            tableNumber: parseInt(tableNumber),
            reservationDate: date,
            reservationTime: time,
            status: { $in: ["confirmed", "pending"] }
        });

        const isAvailable = !conflictingReservation && table.available;

        res.json({ 
            tableNumber: parseInt(tableNumber),
            available: isAvailable,
            conflictingReservation: conflictingReservation ? true : false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const tableId = new ObjectId(req.params.id);
        const { available } = req.body;

        const result = await tablesCollection().updateOne(
            { _id: tableId },
            { $set: { available: available, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Table not found" });
        }

        res.json({ message: "Table status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};