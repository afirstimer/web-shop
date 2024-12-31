import express from "express";
import {     
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting
} from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/", getSetting);
router.post("/", createSetting);
router.put("/:id", updateSetting);
router.delete("/:id", deleteSetting);

export default router;