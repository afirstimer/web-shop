import express from "express";
import { 
    getCategories,
    deleteCategory,
    getTikTokCategories,
    getTikTokCategoryAttributes
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/attributes", getTikTokCategoryAttributes);
router.get("/tiktok", getTikTokCategories);
router.delete("/:id", deleteCategory);

export default router;