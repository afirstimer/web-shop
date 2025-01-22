import prisma from "../lib/prisma.js";
import { callTiktokApi } from "./tiktok.service.js";

export const getTiktokOrders = async (req, shop, payload) => {
    try {
        const extraParams = {
            'shop_cipher': shop.tiktokShopCipher,
            'page_size': 20,
            'sort_order': 'DESC',
            'page_token': '',
            'sort_field': 'create_time'
        }        
        const response = await callTiktokApi(req, shop, false, false, "POST", "/order/202309/orders/search", "application/json", extraParams);

        console.log(response.data);
        if (response.data.data) {
            return response.data.data;
        }
        return false;
    } catch (error) {
        console.log();
    }
}