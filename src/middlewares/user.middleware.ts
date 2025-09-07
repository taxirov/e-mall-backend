import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        if (!token) {
            res.status(403).json({
                message: "Token not provided"
            })
        } else {
            const payload = jwt.verify(token, process.env.SECRET_KEY!)
            res.locals.payload = payload
            next()
        }
    }
    catch (error: any) {
        res.json({
            message: error.message
        })
    }
}


