import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import axios from "axios";
import { readJSONFile, writeJSONFile } from "../helper/helper.js";

const ORDER_FILE = "./dummy/tiktok/orders.json";

export const getOrders = async (req, res) => {
    try {
        const data = await readJSONFile(ORDER_FILE);
        const orders = data.orders;
        // Loop orders and count total amount of orders with group by month
        const ordersByMonth = {};
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const month = new Date(order.create_time * 1000).getMonth();
            const monthName = monthNames[month];
            if (!ordersByMonth[monthName]) {
                ordersByMonth[monthName] = 0;
            }
            ordersByMonth[monthName] += 1;
        }

        // fill ordersByMonth with 0 if month not found
        const sortedMonthNames = monthNames.slice().sort((a, b) => {
            const aIndex = monthNames.indexOf(a);
            const bIndex = monthNames.indexOf(b);
            return aIndex - bIndex;
        });
        const newOrdersByMonth = {};
        for (let i = 0; i < sortedMonthNames.length; i++) {
            const monthName = sortedMonthNames[i];
            if (!ordersByMonth[monthName]) {
                newOrdersByMonth[monthName] = 0;
            } else {
                newOrdersByMonth[monthName] = ordersByMonth[monthName];
            }
        }

        const paymentByMonth = {};
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const month = new Date(order.create_time * 1000).getMonth();
            const monthName = monthNames[month];
            if (!paymentByMonth[monthName]) {
                paymentByMonth[monthName] = 0;
            }
            paymentByMonth[monthName] += parseFloat(order.payment.total_amount);
        }

        // fill paymentByMonth with 0 if month not found        
        for (let i = 0; i < sortedMonthNames.length; i++) {
            const monthName = sortedMonthNames[i];
            if (!paymentByMonth[monthName]) {
                paymentByMonth[monthName] = 0;
            }
        }
        console.log(paymentByMonth);

        const analysis = [];
        for (const [month, total] of Object.entries(newOrdersByMonth)) {
            const revenue = paymentByMonth[month] || 0;
            analysis.push({ month, total, revenue });
        }
        
        res.status(200).json(analysis);
    } catch (error) {
        console.error("Error get orders: ", error);
        res.status(500).json({ error: "Failed to get orders" });
    }
}