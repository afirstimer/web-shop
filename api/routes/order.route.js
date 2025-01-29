import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import { 
    getOrders,
    getOrderStats
 } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.get("/stats", verifyToken, getOrderStats);

export default router;