import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateSign } from "../helper/tiktok.api.js";
import fetch from "node-fetch";
import axios from "axios";
import { readJSONFile } from "../helper/helper.js";

export const getTemplates = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authenticated!" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (err) return res.status(403).json({ message: "Token is not Valid!" });
            req.userId = payload.id;
        });

        const templates = await prisma.template.findMany({});

        const categories = await readJSONFile("./dummy/tiktok/categories.json");
        templates.forEach(template => {
            const category = categories.find(c => c.id === template.categoryId);
            template.categoryId = category?.name;
        });
        res.status(200).json(templates);
    } catch (error) {
        console.log(error);
    }
}

export const getTemplate = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authenticated!" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (err) return res.status(403).json({ message: "Token is not Valid!" });
            req.userId = payload.id;
        });

        const { id } = req.params;
        const template = await prisma.template.findUnique({
            where: {
                id: id
            }
        });
        res.status(200).json(template);
    } catch (error) {
        console.log(error);
    }
}

export const getTemplatesByShop = async (req, res) => { }

export const createTemplate = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authenticated!" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (err) return res.status(403).json({ message: "Token is not Valid!" });
            req.userId = payload.id;
        });

        const newTemplate = await prisma.template.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                productTemplate: req.body.productTemplate,
                productTemplateDescription: req.body.templateDescription,
                categoryId: req.body.categoryId,
                attributes: req.body.attributes,
                compliances: req.body.compliances,
                skus: req.body.skus,
                identifierCode: req.body.identifierCode,
                skuPrice: req.body.skuPrice,
                skuQty: req.body.inventoryQuantity,
                skuSeller: req.body.sellerSku,
                isSale: req.body.isSale ? 1 : 0,
                isCOD: req.body.isCOD ? 1 : 0,
                packageWeight: req.body.packageWeightValue,
                packageLength: req.body.packageDimensionLength,
                packageWidth: req.body.packageDimensionWidth,
                packageHeight: req.body.packageDimensionHeight
            }
        });
        res.status(201).json(newTemplate);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Please recheck your inputs" });
    }
}

export const updateTemplate = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authenticated!" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (err) return res.status(403).json({ message: "Token is not Valid!" });
            req.userId = payload.id;
        });

        const { id } = req.params;
        const updatedTemplate = await prisma.template.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                productTemplate: req.body.productTemplate,
                productTemplateDescription: req.body.templateDescription,
                categoryId: req.body.categoryId,
                attributes: req.body.attributes,
                compliances: req.body.compliances,
                skus: req.body.skus,
                identifierCode: req.body.identifierCode,
                skuPrice: req.body.skuPrice,
                skuQty: req.body.inventoryQuantity,
                skuSeller: req.body.sellerSku,
                isSale: req.body.isSale ? 1 : 0,
                isCOD: req.body.isCOD ? 1 : 0,
                packageWeight: req.body.packageWeightValue,
                packageLength: req.body.packageDimensionLength,
                packageWidth: req.body.packageDimensionWidth,
                packageHeight: req.body.packageDimensionHeight
            }
        });

        res.status(200).json(updatedTemplate);
    } catch (error) {
        console.log(error);
    }
 }

export const deleteTemplate = async (req, res) => { }