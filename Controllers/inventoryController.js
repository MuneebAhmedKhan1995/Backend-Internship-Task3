import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const inventoryCollection=mydb.collection("inventory")


export const addInventoryItem = async (req, res) => {
    try {
        const inventoryItem = {
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            unit: req.body.unit,
            minThreshold: req.body.minThreshold || 10,
            supplier: req.body.supplier || "",
            lastRestocked: new Date(),
            createdAt: new Date()
        };

        const response = await inventoryCollection().insertOne(inventoryItem);
        res.status(201).json({ 
            message: "Inventory item added successfully", 
            id: response.insertedId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getInventory = async (req, res) => {
    try {
        const { lowStock } = req.query;
        let query = {};
        
        if (lowStock === 'true') {
            query = { quantity: { $lte: "$minThreshold" } };
        }

        const inventory = await inventoryCollection().find(query).toArray();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const { quantity, operation } = req.body;

        const item = await inventoryCollection().findOne({ _id: itemId });
        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        let newQuantity = item.quantity;
        if (operation === 'add') {
            newQuantity += quantity;
        } else if (operation === 'subtract') {
            newQuantity = Math.max(0, newQuantity - quantity);
        }

        const result = await inventoryCollection().updateOne(
            { _id: itemId },
            { 
                $set: { 
                    quantity: newQuantity,
                    lastRestocked: operation === 'add' ? new Date() : item.lastRestocked,
                    updatedAt: new Date()
                } 
            }
        );

        res.json({ 
            message: "Inventory updated successfully",
            newQuantity: newQuantity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStockAlerts = async (req, res) => {
    try {
        const lowStockItems = await inventoryCollection().find({
            $expr: { $lte: ["$quantity", "$minThreshold"] }
        }).toArray();

        res.json({
            alerts: lowStockItems.map(item => ({
                name: item.name,
                currentQuantity: item.quantity,
                minThreshold: item.minThreshold,
                alert: `Low stock: ${item.quantity} ${item.unit} remaining`
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};