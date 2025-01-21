import prisma from "../lib/prisma.js";
import { uploadImageToTiktok } from "../services/product.service.js";

export const testController = async (req, res) => {
    try {
        let uriImage = 'https://res.cloudinary.com/dg5multm4/image/upload/v1737442727/dhzfjxdfq8se1sco4fch.jpg';
        const shop = await prisma.shop.findFirst();
        const uploadResponse = await uploadImageToTiktok(req, shop, uriImage, 'MAIN_IMAGE');
        console.log(uploadResponse);
        res.status(200).json(uploadResponse);
    } catch (error) {
        console.log(error);
    }
}