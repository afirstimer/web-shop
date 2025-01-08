import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import axios from "axios";

export const crawlAmazonProduct = async (req, res) => {
    try {

        // check Bearer token
        let token = req.headers.authorization.split(" ")[1];
        // compare with accessToken in setting
        const settings = await prisma.setting.findMany();
        if (!settings.length) {
            res.status(404).json({ message: "Setting not found" });
        }
        const setting = settings[0];
        if (setting.accessToken !== token) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const { title, images, price, crawlUrl, description, productInfo, deliveryTime } = req.body;

        const users = await prisma.user.findMany();
        const user = users[0];

        const listing = await prisma.listing.create({
            data: {
                name: title,
                images,
                price,
                crawlUrl,
                sku: productInfo.asin,
                productDimension: productInfo.productDimensions || null,
                packageDimension: productInfo.packageDimensions || null,
                itemModelNumber: productInfo.modelNum || null,
                upc: productInfo.upc || null,
                manufacturer: productInfo.manufacture || null,
                countryOfOrigin: productInfo.originCountry || null,
                description: description,
                userId: user.id
            },
        });

        res.status(201).json({
            message: "Crawled Amazon product successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getListings = async (req, res) => {
    try {
        const { page = 1, limit = process.env.DEFAULT_LIMIT, name, sku, sort } = req.query;

        const pageNum = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const where = {
            ...(name && {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            }),
            ...(sku && {
                sku: {
                    contains: sku,
                    mode: "insensitive",
                },
            }),
        };

        const orderBy = (() => {
            switch (sort) {
                case "newest":
                    return { createdAt: "desc" };
                case "oldest":
                    return { createdAt: "asc" };
                case "updated_newest":
                    return { updatedAt: "desc" };
                case "updated_oldest":
                    return { updatedAt: "asc" };
                default:
                    return { createdAt: "desc" };
            }
        })();

        const total = await prisma.listing.count({
            where
        });

        // get listings and sort by createdAt desc
        const listings = await prisma.listing.findMany({
            where,
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            orderBy
        });

        res.status(200).json({
            total,
            page: pageNum,
            limit: pageSize,
            listings
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateListing = async (req, res) => {
    try {        
        const listing = await prisma.listing.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.status(200).json(listing);
    } catch (error) {
        console.log(error);
    }
}

export const getListing = async (req, res) => {
    try {        
        const listing = await prisma.listing.findUnique({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(listing);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteListing = async (req, res) => {
    try {        
        await prisma.listing.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({ message: "Listing deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
