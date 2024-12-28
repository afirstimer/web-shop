import express from "express";
import { 
    getSettings, 
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting
} from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/", getSettings);
router.get("/:id", getSetting);
router.post("/", createSetting);
router.put("/:id", updateSetting);
router.delete("/:id", deleteSetting);

export default router;