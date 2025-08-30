import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Role } from "@prisma/client"
import jwt from 'jsonwebtoken';

// type UserResponse = {
//   id: number,
//   name: string,
//   username: string,
//   image: null | string,
//   phone: string,
//   email: string,
//   salary: number,
//   role: string | undefined,
//   orders: number,
//   status: number,
//   create_date: Date,
//   update_date: Date
// }

// export type Payload = {
//   id: number,
//   name: string,
//   username: string,
//   phone: string
// }

const userService = new UserService();

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const { nickname, password, phone } = req.body;
            const user_exsist = await userService.findByPhone(phone)
            if (user_exsist) {
                res.status(409).json({ message: "User already exsist with phone: " + phone })
            } else {
                const user = await userService.create({ nickname, password, phone });
                const token = jwt.sign({ nickname: user.nickname, phone: user.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                const userCreated = {
                    id: user.id,
                    nickname: user.nickname,
                    firstName: user.firstName,
                    phone: user.phone,
                    salary: user.salary,
                    orders: 0,
                    role: user.roles,
                    status: user.isActive,
                    create_date: user.createdAt,
                    update_date: user.updatedAt
                }
                res.status(200).json({
                    message: "Register success",
                    user: userCreated,
                    token
                })
            }
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { phone, password } = req.body;
            const user_exsist = await userService.findByPhone(phone);
            if (!user_exsist) {
                res.status(404).json({
                    message: "User not found"
                })
            } else {
                if (user_exsist.isActive == false) {
                    res.status(403).json({
                        message: "You are not active site. Please contact admin."
                    })
                } else {
                    if (password === user_exsist.password) {
                        const role = user_exsist.roles
                        const token = jwt.sign({ nickname: user_exsist.nickname, phone: user_exsist.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                        const userExsist = {
                            id: user_exsist.id,
                            nickname: user_exsist.nickname,
                            firstName: user_exsist.firstName,
                            phone: user_exsist.phone,
                            salary: user_exsist.salary,
                            orders: 0,
                            role: user_exsist.roles,
                            status: user_exsist.isActive,
                            create_date: user_exsist.createdAt,
                            update_date: user_exsist.updatedAt
                        }
                        res.status(200).json({
                            message: "Login success",
                            user: userExsist,
                            token
                        })
                    } else {
                        res.status(401).json({
                            message: "Password or username wrong"
                        })
                    }
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Error login user"
            })
        }
    }
}