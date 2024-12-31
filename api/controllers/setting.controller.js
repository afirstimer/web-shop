import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import axios from "axios";

export const getSetting = async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        if (!settings.length) {
            res.status(404).json({ message: "Setting not found" });
        }
        const setting = settings[0];
        res.status(200).json(setting);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const createSetting = async (req, res) => {
    try {
        // generate token
        const accessToken = jwt.sign({
            id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
        }, process.env.JWT_SECRET_KEY);
        const expiredIn = Date.now() + 3600000;
        const newSetting = await prisma.setting.create({
            data: {
                accessToken,
                expiredIn
            },
        });
        res.status(201).json(newSetting);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateSetting = async (req, res) => {
    try {
        // generate token
        const accessToken = jwt.sign({
            id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
        }, process.env.JWT_SECRET_KEY);
        const expiredIn = Date.now() + 3600000;
        const updatedSetting = await prisma.setting.update({
            where: {
                id: req.params.id,
            },
            data: {
                accessToken,
                expiredIn
            },
        });
        res.status(200).json(updatedSetting);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


export const deleteSetting = async (req, res) => {
    try {
       res.status(200).json({message: "Deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}