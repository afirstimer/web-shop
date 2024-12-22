import express from "express";
import {
    getShops,
    getShop, 
    createShop, 
    updateShop, 
    requestAuthorizedShops, 
    getTiktokShopInfo,
    refreshToken
} from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", getShops);
router.get("/token/refresh", refreshToken);
router.get("/authorize", requestAuthorizedShops);
router.get("/shop/:id", getShop);
router.post("/", createShop);
router.put("/:id", updateShop);
router.get("/tiktok/:id", getTiktokShopInfo);

export default router;