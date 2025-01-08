import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany();
        res.status(200).json(teams);
    } catch (error) {
        console.log(error);
    }
};

export const getTeam = async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(team);
    } catch (error) {
        console.log(error);
    }
};

export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;

        const newTeam = await prisma.team.create({
            data: {
                name,
            },
        });

        res.status(201).json({
            message: "Team created successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateTeam = async (req, res) => {
    try {
        const { name } = req.body;

        const updatedTeam = await prisma.team.update({
            where: {
                id: req.params.id,
            },
            data: {
                name,
            },
        });

        res.status(200).json(updatedTeam);
    } catch (error) {
        console.log(error);
    }
};

export const deleteTeam = async (req, res) => { };