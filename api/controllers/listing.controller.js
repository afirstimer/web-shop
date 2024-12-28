import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import axios from "axios";

export const crawlAmazonProduct = async (req, res) => {
    try {
        const { title, images, price } = req.body;

        const users = await prisma.user.findMany();
        const user = users[0];

        const shops = await prisma.shop.findMany();
        const shop = shops[0];

        const listing = await prisma.listing.create({
            data: {
                name: title,
                images,
                price,
                code: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
                description: "Description",                
                userId: user.id,
                shopId: shop.id                
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
        const listings = await prisma.listing.findMany();
        res.status(200).json(listings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
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
