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

}

// update shop
export const updateShop = async (req, res) => {

}

// authorize shop
export const requestAuthorizedShops = async (request, res) => {
    const { app_key, access_token, secret } = request.query;    

    if (!app_key || !secret || !access_token) {
        console.log(app_key, secret, access_token);
        console.error("Missing required parameters: app_key, secret, or access_token");
        throw new Error("Missing required parameters: app_key, secret, or access_token");
    }

    request.query.path = "/authorization/202309/shops";
    const timestamp = Math.floor(Date.now() / 1000);
    const header = request.headers['content-type'];
    console.log(header);
    const sign = generateSign(request, secret, timestamp, header);    
    console.log(sign);

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
            "x-tts-access-token": process.env.TIKTOK_SHOP_ACCESS_TOKEN
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
    try {
        const response = await axios({
            method: options.method,
            url: options.url,
            headers: options.headers
        });
        // res.status(200).json(response.data);

        // create shop
        console.log(response.data);
        if (response.data.code === 0) {
            // get user
            const users = await prisma.user.findMany({});
            const user = users[0];
            console.log(user);

            for (const shop of response.data.data.shops) {
                console.log(shop);
                
                // find shop by code
                const existingShop = await prisma.shop.findUnique({
                    where: {
                        code: shop.code,
                    },
                });
                console.log(existingShop);
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
                            tiktokTimestamp: timestamp                            
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
                            tiktokTimestamp: timestamp                           
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
    const params = {
        app_key: process.env.TIKTOK_SHOP_APP_KEY,
        app_secret: process.env.TIKTOK_SHOP_APP_SECRET,
        refresh_token: process.env.TIKTOK_SHOP_REFRESH_TOKEN,
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

            return { accessToken, refreshToken };
        } else {
            console.error('API Error:', response.data);
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
}