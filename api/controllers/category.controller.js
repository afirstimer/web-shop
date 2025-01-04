import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateSign } from "../helper/tiktok.api.js";
import fetch from "node-fetch";
import axios from "axios";
import { readJSONFile, writeJSONFile } from "../helper/helper.js";

const CATEGORY_FILE = "./dummy/tiktok/categories.json";

// get all shops
export const getCategories = async (req, res) => {
    try {
        const categories = await readJSONFile(CATEGORY_FILE);
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get categories!" });
    }
}

// Get categories from TikTok
export const getTikTokCategories = async (request, res) => {
    const app_key = process.env.TIKTOK_SHOP_APP_KEY;
    const secret = process.env.TIKTOK_SHOP_APP_SECRET;
    const category_version = process.env.TIKTOK_CATEGORY_VERSION;    

    // TODO: lấy token
    const setting = await prisma.setting.findFirst();
    if (!setting) {
        console.error("Setting not found");
        return res.status(404).json({ message: "Setting not found" });
    }
    const access_token = setting.shopAccessToken;
    console.log(access_token);

    // TODO: lấy shop mặc định
    const shop = await prisma.shop.findFirst({
        where: {
            defaultShop: 1
        }
    });    
    console.log(shop);    
    if (!shop) {
        console.error("Shop not found");
        return res.status(404).json({ message: "Shop not found" });
    }    
    const shop_cipher = shop.tiktokShopCipher;

    // Param
    request.query.category_version = category_version;
    request.query.shop_id = shop.id;
    request.query.access_token = access_token;
    request.query.app_key = app_key;
    request.query.secret = secret;
    request.query.shop_cipher = shop_cipher;
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
            app_key: app_key,
            sign: "{{sign}}",
            timestamp: "{{timestamp}}",
            shop_cipher: shop.tiktokShopCipher,
            category_version: category_version
        },
        headers: {
            "x-tts-access-token": setting.shopAccessToken,
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
        const categoryRes = [];
        for (const category of categories) {
            categoryRes.push({
                id: category.id,
                name: category.local_name,
                tiktokId: category.id,
                tiktokParentId: category.parent_id,
            });            
        }

        await writeJSONFile(CATEGORY_FILE, categoryRes);

        res.status(200).json(categoryRes);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error });
    }
}

export const getTikTokCategoryAttributes = async (request, res) => {
    const { category_id } = request.query;    
    
    const app_key = process.env.TIKTOK_SHOP_APP_KEY;
    const secret = process.env.TIKTOK_SHOP_APP_SECRET;
    const category_version = process.env.TIKTOK_CATEGORY_VERSION;    

    //TODO: nên lấy shop mặc định (lưu ý chỉ 1 shop mặc định)
    const shop = await prisma.shop.findFirst({
        where: {
            defaultShop: 1
        }
    });
    console.log(shop);
    if (!shop) {
        console.error("Shop not found");
        return res.status(404).json({ message: "Shop not found" });
    }

    // TODO: lấy token
    const setting = await prisma.setting.findFirst();
    if (!setting) {
        console.error("Setting not found");
        return res.status(404).json({ message: "Setting not found" });
    }
    const access_token = setting.shopAccessToken;

    // Param
    request.query.category_version = category_version;
    request.query.shop_id = shop.id;
    request.query.category_id = category_id;
    request.query.access_token = access_token;
    request.query.app_key = app_key;
    request.query.secret = secret;
    request.query.shop_cipher = shop.tiktokShopCipher;
    request.query.path = "/product/202309/categories/" + category_id + "/attributes";
    const timestamp = Math.floor(Date.now() / 1000);
    const header = request.headers['content-type'];
    const sign = generateSign(request, secret, timestamp, header);
    console.log(sign);

    // Define your request details
    const options = {
        method: "GET",
        url: "https://open-api.tiktokglobalshop.com/product/202309/categories/" + category_id + "/attributes",
        query: {
            app_key: process.env.TIKTOK_SHOP_APP_KEY,
            sign: "{{sign}}",
            timestamp: "{{timestamp}}",
            shop_cipher: shop.tiktokShopCipher,
            category_version: 'v2'
        },
        headers: {
            "x-tts-access-token": setting.shopAccessToken,
            "Content-Type": "application/json"
        }
    };

    // Prepare the request object for signature calculation
    const req = {
        url: {
            path: "/product/202309/categories/" + category_id + "/attributes",
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
        console.log(response.data);
        const attributes = response.data.data.attributes;        

        res.status(200).json(attributes);        
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