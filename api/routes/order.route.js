import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import { 
    getOrders
 } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);

export default router;