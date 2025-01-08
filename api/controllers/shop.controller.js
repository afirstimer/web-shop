import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateSign } from "../helper/tiktok.api.js";
import fetch from "node-fetch";
import axios from "axios";

// get all shops
export const getShops = async (req, res) => {
    try {        
        const shops = await prisma.shop.findMany({
            include: {
                User: {
                    select: {
                        username: true,
                        email: true,
                        avatar: true
                    }
                }
            },
        });
        res.status(200).json(shops);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get shops!" });
    }
}

// create shop
export const createShop = async (req, res) => {
    try {        
        const { name, manager, team } = req.body;
        const newShop = await prisma.shop.create({
            data: {
                name,
                manager,
                team,
            },
        });
        res.status(201).json(newShop);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create shop!" });
    }
}

// get shop
export const getShop = async (req, res) => {
    try {        
        const shop = await prisma.shop.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                User: {
                    select: {
                        username: true,
                        email: true,
                        avatar: true
                    }
                }
            },
        });
        res.status(200).json(shop);
    } catch (error) {
        console.log(error);
    }
}

// get active shops
export const getActiveShops = async (request, res) => {
    try {
        const app_key = process.env.TIKTOK_SHOP_APP_KEY;
        const secret = process.env.TIKTOK_SHOP_APP_SECRET;
        const setting = await prisma.setting.findFirst();
        if (!setting) {
            console.error("Setting not found");
            return res.status(404).json({ message: "Setting not found" });
        }
        const access_token = setting.shopAccessToken;

        if (!app_key || !secret || !access_token) {
            console.log(app_key, secret, access_token);
            console.error("Missing required parameters: app_key, secret, or access_token");
            throw new Error("Missing required parameters: app_key, secret, or access_token");
        }

        request.query.path = "/seller/202309/shops";
        request.query.access_token = access_token;
        request.query.app_key = app_key;
        request.query.secret = secret;
        const timestamp = Math.floor(Date.now() / 1000);
        const header = request.headers['content-type'];
        const sign = generateSign(request, secret, timestamp, header);

        // Define your request details
        const options = {
            method: "GET",
            url: "https://open-api.tiktokglobalshop.com/seller/202309/shops",
            query: {
                app_key: app_key,
                sign: "{{sign}}",
                timestamp: "{{timestamp}}"
            },
            headers: {
                "x-tts-access-token": setting.shopAccessToken
            }
        };

        // Prepare the request object for signature calculation
        const req = {
            url: {
                path: "/authorization/202309/shops",
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

        // Make the GET request    
        const response = await axios({
            method: options.method,
            url: options.url,
            headers: options.headers
        });

        if (response.data.message == 'Success') {
            const shops = response.data.data.shops;
            res.status(200).json(shops);
        } else {
            console.error("Error:", response.data);
            throw new Error("Failed to get active shops");
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

// get shops
export const getShopsByUser = async (req, res) => {
    try {        
        const shops = await prisma.shop.findMany({
            where: {
                userId: req.params.id
            },
            include: {
                User: {
                    select: {
                        username: true,
                        email: true,
                        avatar: true
                    }
                }
            },
        });

        res.status(200).json(shops);
    } catch (error) {
        console.log(error);
    }
}

// update shop
export const updateShop = async (req, res) => {
    try {        
        const updatedShop = await prisma.shop.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });

        res.status(200).json(updatedShop);
    } catch (error) {
        console.log(error);
    }
}

// authorize shop
export const requestAuthorizedShops = async (request, res) => {
    try {                
        const app_key = process.env.TIKTOK_SHOP_APP_KEY;
        const secret = process.env.TIKTOK_SHOP_APP_SECRET;
        const setting = await prisma.setting.findFirst();
        if (!setting) {
            console.error("Setting not found");
            return res.status(404).json({ message: "Setting not found" });
        }
        const access_token = setting.shopAccessToken;

        if (!app_key || !secret || !access_token) {
            console.log(app_key, secret, access_token);
            console.error("Missing required parameters: app_key, secret, or access_token");
            throw new Error("Missing required parameters: app_key, secret, or access_token");
        }

        request.query.access_token = access_token;
        request.query.app_key = app_key;
        request.query.secret = secret;
        request.query.path = "/authorization/202309/shops";
        const timestamp = Math.floor(Date.now() / 1000);
        const header = request.headers['content-type'];
        const sign = generateSign(request, secret, timestamp, header);

        // Define your request details
        const options = {
            method: "GET",
            url: "https://open-api.tiktokglobalshop.com/authorization/202309/shops",
            query: {
                app_key: process.env.TIKTOK_SHOP_APP_KEY,
                sign: "{{sign}}",
                timestamp: "{{timestamp}}"
            },
            headers: {
                "x-tts-access-token": setting.shopAccessToken
            }
        };

        // Prepare the request object for signature calculation
        const req = {
            url: {
                path: "/authorization/202309/shops",
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

        // Make the GET request

        const response = await axios({
            method: options.method,
            url: options.url,
            headers: options.headers
        });        

        // create shop
        console.log(response.data);
        if (response.data.code === 0) {
            // get user
            const user = await prisma.user.findUnique({
                where: {
                    id: request.userId,
                },
            });            

            for (const shop of response.data.data.shops) {                
                // find shop by code
                const existingShop = await prisma.shop.findUnique({
                    where: {
                        code: shop.code,
                    },
                });
                
                if (existingShop) {
                    // update
                    await prisma.shop.update({
                        where: {
                            id: existingShop.id,
                        },
                        data: {
                            status: "authorized",
                            signString: sign,
                            tiktokShopCipher: shop.cipher,
                            tiktokTimestamp: timestamp,
                            tiktokShopId: shop.id
                        },
                    });
                } else {
                    const newShop = await prisma.shop.create({
                        data: {
                            name: shop.name,
                            code: shop.code,
                            userId: user.id,
                            status: "authorized",
                            refreshToken: process.env.TIKTOK_SHOP_REFRESH_TOKEN,
                            accessToken: access_token,
                            priceDiff: 0,
                            shopItems: 0,
                            images: [],
                            signString: sign,
                            tiktokShopCipher: shop.cipher,
                            tiktokTimestamp: timestamp,
                            tiktokShopId: shop.id
                        },
                    });
                }
            }

            res.status(200).json(response.data);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

// get shop info from tiktok
export const getTiktokShopInfo = async (req, res) => {

}

// refresh token
export const refreshToken = async (req, res) => {    
    const url = 'https://auth.tiktok-shops.com/api/v2/token/refresh';

    console.log('Refreshing token...');
    // Get first setting
    const setting = await prisma.setting.findFirst();

    const params = {
        app_key: process.env.TIKTOK_SHOP_APP_KEY,
        app_secret: process.env.TIKTOK_SHOP_APP_SECRET,
        refresh_token: setting.shopRefreshToken,
        grant_type: 'refresh_token'
    };

    try {
        const response = await axios.get(url, { params });
        const { code, message, data } = response.data;

        console.log('API Response:', response.data);

        if (code === 0 && message === 'success') {
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;

            console.log('Access Token:', accessToken);
            console.log('Refresh Token:', refreshToken);

            setting.shopAccessToken = accessToken;
            setting.shopRefreshToken = refreshToken;
            const updatedSetting = await prisma.setting.update({
                where: {
                    id: setting.id,
                },
                data: {
                    shopAccessToken: accessToken,
                    shopRefreshToken: refreshToken
                },
            });

            res.status(200).json({ accessToken, refreshToken });
        } else {
            console.error('API Error:', response.data);
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
}