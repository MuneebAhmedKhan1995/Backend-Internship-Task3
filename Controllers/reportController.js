import {client} from "../dbConfig.js"
import { ObjectId } from "mongodb"
const mydb= client.db("Task3")
const ordersCollection=mydb.collection("orders")
const reservationsCollection=mydb.collection("reservations")
const inventoryCollection=mydb.collection("inventory")


export const getDailySales = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const sales = await ordersCollection().aggregate([
            {
                $match: {
                    orderTime: { $gte: startOfDay, $lte: endOfDay },
                    status: { $in: ["completed", "paid"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: "$totalAmount" }
                }
            }
        ]).toArray();

        const result = sales.length > 0 ? sales[0] : {
            totalSales: 0,
            totalOrders: 0,
            averageOrderValue: 0
        };

        res.json({
            date: targetDate.toISOString().split('T')[0],
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPopularItems = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const popularItems = await ordersCollection().aggregate([
            {
                $match: {
                    orderTime: { $gte: startDate }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]).toArray();

        res.json(popularItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTableOccupancy = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        
        const reservations = await reservationsCollection().countDocuments({
            reservationDate: targetDate.toISOString().split('T')[0],
            status: "confirmed"
        });

        const totalTables = await getDb().collection("tables").countDocuments();

        res.json({
            date: targetDate.toISOString().split('T')[0],
            reservations: reservations,
            totalTables: totalTables,
            occupancyRate: ((reservations / totalTables) * 100).toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};