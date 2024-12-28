import express from "express";
import { 
    crawlAmazonProduct,
    getListings,
    getListing
} from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/", crawlAmazonProduct);
router.get("/", getListings);
router.get("/:id", getListing);

export default router;
