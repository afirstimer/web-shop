import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateSign } from "../helper/tiktok.api.js";
import fetch from "node-fetch";
import axios from "axios";

// get all shops
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.templateProductCategory.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get categories!" });
    }
}

// Get categories from TikTok
export const getTikTokCategories = async (request, res) => {
    const { shop_id, app_key, access_token, secret, category_version } = request.query;         

    if (!app_key || !secret || !access_token) {
        console.log(app_key, secret, access_token);
        console.error("Missing required parameters: app_key, secret, or access_token");
        throw new Error("Missing required parameters: app_key, secret, or access_token");
    }

    const shop = await prisma.shop.findUnique({
        where: {
            id: shop_id
        }
    });

    console.log(shop);
    
    if (!shop) {
        console.error("Shop not found");
        return res.status(404).json({ message: "Shop not found" });
    }

    request.query.shop_cipher = shop.tiktokShopCipher;
    request.query.path = "/product/202309/categories";
    const timestamp = Math.floor(Date.now() / 1000);
    const header = request.headers['content-type'];
    const sign = generateSign(request, secret, timestamp, header);    
    console.log(sign);

    // Define your request details
    const options = {
        method: "GET",
        url: "https://open-api.tiktokglobalshop.com/product/202309/categories",
        query: {
            app_key: process.env.TIKTOK_SHOP_APP_KEY,
            sign: "{{sign}}",
            timestamp: "{{timestamp}}",
            shop_cipher: shop.tiktokShopCipher,            
            category_version: 'v2'
        },
        headers: {
            "x-tts-access-token": process.env.TIKTOK_SHOP_ACCESS_TOKEN
        }
    };

    // Prepare the request object for signature calculation
    const req = {
        url: {
            path: "/product/202309/categories",
            query: Object.entries(options.query).map(([key, value]) => ({ key, value }))
        },
        body: null // No body for GET requests
    };

    // Update the query parameters with calculated values
    options.query.sign = sign;
    options.query.timestamp = timestamp;

    // Interpolate URL
    const queryString = new URLSearchParams(options.query).toString();
    options.url = `${options.url}?${queryString}`;

    console.log(options);

    // Make the GET request
    try {
        const response = await axios({
            method: options.method,
            url: options.url,
            headers: options.headers
        });
        const categories = response.data.data.categories;

        for (const category of categories) {
            await prisma.templateProductCategory.create({
                data: {
                    name: category.local_name,
                    tiktokId: category.id,
                    tiktokParentId: category.parent_id,                                        
                },
            });
        }
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error });
    }
}

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await prisma.templateProductCategory.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(deletedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete category!" });
    }
}