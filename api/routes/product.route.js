import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    getProducts,
    getProduct,
    createProduct,
    editProduct,    
    uploadCert,
    uploadTiktokProducts,
    deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", verifyToken, getProducts);
router.post("/upload-cert", verifyToken, uploadCert);
router.post("/upload-to-tiktok", verifyToken, uploadTiktokProducts);
router.delete("/", verifyToken, deleteProduct);

export default router;