import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    getProducts,
    getProduct,
    createProduct,
    editProduct,    
    uploadCert,
    uploadTiktokProducts
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/upload-cert", verifyToken, uploadCert);
router.post("/upload-to-tiktok", verifyToken, uploadTiktokProducts);

export default router;