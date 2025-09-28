import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const menuCollection=mydb.collection("menu_items")


export const addMenuItem = async (req, res) => {
    try {
        const menuItem = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            ingredients: req.body.ingredients || [],
            available: req.body.available !== false,
            imageUrl: req.body.imageUrl || "",
            createdAt: new Date()
        };

        const response = await menuCollection().insertOne(menuItem);
        if (response.acknowledged) {
            return res.status(201).json({ 
                message: "Menu item added successfully", 
                id: response.insertedId 
            });
        } else {
            return res.status(400).json({ error: "Failed to add menu item" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMenu = async (req, res) => {
    try {
        const { category, available } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (available !== undefined) query.available = available === 'true';

        const menuItems = await menuCollection().find(query).toArray();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await menuCollection().updateOne(
            { _id: itemId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.json({ message: "Menu item updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const result = await menuCollection().deleteOne({ _id: itemId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};