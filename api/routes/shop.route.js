import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    getShops,
    getActiveShops,
    getShop, 
    getShopOrders,
    getShopsByUser,
    createShop, 
    updateShop, 
    requestAuthorizedShops, 
    getTiktokShopInfo,
    getMembersOnShop,
    syncOrders,
    refreshToken
} from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", verifyToken, getShops);
router.get("/active", verifyToken, getActiveShops);
router.get("/orders/:id", verifyToken, getShopOrders);
router.get("/token/refresh", verifyToken, refreshToken);
router.get("/authorize", verifyToken, requestAuthorizedShops);
router.get("/shop/:id", verifyToken, getShop);
router.get("/user/:id", verifyToken, getShopsByUser);
router.post("/", verifyToken, createShop);
router.put("/:id", verifyToken, updateShop);
router.get("/tiktok/:id", verifyToken, getTiktokShopInfo);
router.get("/members-on-shop/:id", verifyToken, getMembersOnShop);

/** SYNC */
router.get("/sync-orders/:id", verifyToken, syncOrders);

export default router;