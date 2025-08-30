import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('access-token')
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
    catch (err: any) {
        res.status(401).json({
            message: "Token invalid or expired"
        })
    }
}


