import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateSign } from "../helper/tiktok.api.js";
import fetch from "node-fetch";
import axios from "axios";

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
        res.status(200).json(templates);
    } catch (error) {
        console.log(error);
    }
}

export const getTemplate = async (req, res) => { }

export const getTemplatesByShop = async (req, res) => { }

export const createTemplate = async (req, res) => { }

export const updateTemplate = async (req, res) => { }

export const deleteTemplate = async (req, res) => { }