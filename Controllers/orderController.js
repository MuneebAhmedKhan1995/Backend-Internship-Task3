import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const ordersCollection=mydb.collection("orders")
const inventoryCollection=mydb.collection("inventory")

export const placeOrder = async (req, res) => {
    try {
        const { tableNumber, items, customerName, specialInstructions } = req.body;

       
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += item.price * item.quantity;
        }

        const order = {
            tableNumber: parseInt(tableNumber),
            items: items,
            totalAmount: totalAmount,
            customerName: customerName || "Walk-in Customer",
            specialInstructions: specialInstructions || "",
            status: "pending",
            orderTime: new Date(),
            createdAt: new Date()
        };

        
        for (const item of items) {
            for (const ingredient of item.ingredients || []) {
                await inventoryCollection().updateOne(
                    { name: ingredient.name },
                    { $inc: { quantity: -ingredient.quantity * item.quantity } }
                );
            }
        }

        const response = await ordersCollection().insertOne(order);
        
        res.status(201).json({ 
            message: "Order placed successfully", 
            orderId: response.insertedId,
            totalAmount: totalAmount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { status, tableNumber } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (tableNumber) query.tableNumber = parseInt(tableNumber);

        const orders = await ordersCollection().find(query).sort({ orderTime: -1 }).toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const { status } = req.body;

        const result = await ordersCollection().updateOne(
            { _id: orderId },
            { $set: { status: status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};