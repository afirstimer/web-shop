import express from "express";
import { 
    getCategories,
    deleteCategory,
    getTikTokCategories 
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/tiktok", getTikTokCategories);
router.delete("/:id", deleteCategory);

export default router;