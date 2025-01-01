import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    getShops,
    getShop, 
    getShopsByUser,
    createShop, 
    updateShop, 
    requestAuthorizedShops, 
    getTiktokShopInfo,
    refreshToken
} from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", verifyToken, getShops);
router.get("/token/refresh", verifyToken, refreshToken);
router.get("/authorize", verifyToken, requestAuthorizedShops);
router.get("/shop/:id", verifyToken, getShop);
router.get("/user/:id", verifyToken, getShopsByUser);
router.post("/", verifyToken, createShop);
router.put("/:id", verifyToken, updateShop);
router.get("/tiktok/:id", verifyToken, getTiktokShopInfo);

export default router;