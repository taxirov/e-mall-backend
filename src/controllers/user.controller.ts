import dotenv from 'dotenv';
dotenv.config()
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
// import TelegramBot, { Contact } from "node-telegram-bot-api";
import jwt from 'jsonwebtoken';
import prisma from '../database';
import { Role } from '@prisma/client';


// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// // 1. /start bosilganda tugma yuboramiz
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, "Telefon raqamingizni yuboring:", {
//         reply_markup: {
//             keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
//             one_time_keyboard: true,
//             resize_keyboard: true,
//         },
//     });
// });

// // 2. Telefon raqam kelganda
// bot.on("contact", async (msg) => {
//     const contact = msg.contact;
//     const chatId = msg.chat.id;

//     const phone = contact!.phone_number;
//     const name = contact!.first_name;
//     const username = msg.from?.username || null;

//     // 6 xonali kod yaratamiz
//     const code = Math.floor(100000 + Math.random() * 900000);

//     // Kodni DB yoki cache (Redis) da vaqtinchalik saqlash
//     await userService.createTelegramUser(phone, code, name, username, String(chatId))

//     // Kodni yuborish
//     bot.sendMessage(chatId, `Tasdiqlash kodingiz: ${code}`);
// });

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

// function generateOTP(length: number = 4): string {
//     let otp = "";
//     for (let i = 0; i < length; i++) {
//         otp += Math.floor(Math.random() * 10); // 0-9 oralig‘ida son
//     }
//     return otp;
// }

const userService = new UserService();

export class UserController {

    async login(req: Request, res: Response) {
        try {
            const { nickname, password } = req.body;
            const userExsist = await userService.findByNicknameWithPassword(nickname);
            if (!userExsist) {
                res.status(404).json({
                    message: "Foydalanuvchi topilmadi"
                })
            } else {
                if (userExsist.isActive == false) {
                    res.status(403).json({
                        message: "Sizning statusingiz faol emas. Iltimos admin bilan bog'laning!"
                    })
                } else {
                    if (password === userExsist.password) {
                        const token = jwt.sign({ nickname: userExsist.nickname, phone: userExsist.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                        let userIpAddress =
                            (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
                            req.socket.remoteAddress || null;

                        if (userIpAddress?.startsWith("::ffff:")) {
                            userIpAddress = userIpAddress.replace("::ffff:", "");
                        }
                        const userDeviceName = (req.useragent?.platform ? req.useragent?.platform : null);
                        const userWithToken = await userService.setToken(userExsist.id, token, userIpAddress, userDeviceName)
                        res.status(200).json({
                            message: "Login muvaffaqiyatli",
                            user: userWithToken

                        })
                    } else {
                        res.status(401).json({
                            message: "Parol xato! Iltimos qayta urinib ko'ring"
                        })
                    }
                }
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // async telegramVerify(req: Request, res: Response) {
    //     try {
    //         const { code } = req.body;
    //         const userPending = (await userService.getTelegramUser(code))[0]
    //         if (userPending) {
    //             if (userPending.username) {
    //                 const userCreated = await userService.create({ nickname: userPending.username, phone: userPending.phone })
    //                 const token = jwt.sign({ nickname: userPending.username, phone: userPending.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
    //                 const userWithToken = await userService.setToken({ phone: userCreated.phone, token })
    //                 await userService.deactiveTelegramUser(userPending.id)
    //                 res.status(200).json({
    //                     message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
    //                     userWithToken
    //                 })
    //             } else {
    //                 const userCreated = await userService.create({ nickname: `u${userPending.phone}`, phone: userPending.phone })
    //                 const token = jwt.sign({ nickname: userCreated.nickname, phone: userCreated.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
    //                 const userWithToken = await userService.setToken({ phone: userCreated.phone, token })
    //                 await userService.deactiveTelegramUser(userPending.id)
    //                 res.status(200).json({
    //                     message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
    //                     userWithToken
    //                 })
    //             }

    //         } else {
    //             res.status(403).json({
    //                 message: "Kod eskirgan"
    //             })
    //         }
    //     } catch (error) { }
    // }

    // POST /users
    async registerViaOtp(req: Request, res: Response) {
        try {
            const { nickname, phone, password } = req.body;
            // nickname orqali tekshirish
            const userCheckByNickname = await userService.findByNickname(nickname)
            if (userCheckByNickname) { res.status(409).json({ message: "User already exsist with this: " + nickname + " nickname!" }) }
            // telefon raqam orqali tekshirish
            const userCheckByPhone = await userService.findByPhone(phone)
            if (userCheckByPhone) { res.status(409).json({ message: "User already exsist with this: " + phone + " phone!" }) }

            const otp = 1111;
            // res.locals.otpExpire = Date.now() + 2 * 60 * 1000; // 2 daqiqa amal qiladi

            // let messageData = {
            //     mobile_phone: '998' + phone,
            //     message: "E-mall tizimidan ro'yhatdan o'tish uchun kodingiz: " + otp,
            //     from: '4546'
            // }

            // await axios.post('https://notify.eskiz.uz/api/message/sms/send', messageData, { headers: { Authorization: 'Bearer ' + process.env.SMS_TOKEN } })
            const token = jwt.sign({ nickname, phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
            const userPending = await prisma.userPending.create({ data: { phone, password, nickname, token, otp } })
            res.status(200).json({
                message: "Tasdiqlash kodi jo'natildi",
                token
            })

        } catch (error) {
            res.status(500).json({ error });
        }
    }
    async verifyOtp(req: Request, res: Response) {
        const { otp } = req.body;

        // if (!res.locals.otp || !res.locals.pendingUser) {
        //     return res.status(400).json({ error: "Foydalanuchi topilmadi" });
        // }

        // if (res.locals.otpExpire < Date.now()) {
        //     return res.status(400).json({ error: "Kod muddati tugagan" });
        // }

        const userPending = await prisma.userPending.findUnique({ where: { phone: res.locals.payload.phone, status: true } })
        if (!userPending) {
            res.status(403).json({
                message: "Kod eskirgan"
            })
        } else {
            let userIpAddress =
                (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
                req.socket.remoteAddress || null;

            if (userIpAddress?.startsWith("::ffff:")) {
                userIpAddress = userIpAddress.replace("::ffff:", "");
            }
            const userDeviceName = (req.useragent?.os ? req.useragent?.os : null);
            const userCreated = await userService.create(userPending!.nickname, userPending!.phone, userPending!.password)
            const userWithToken = await userService.setToken(userCreated.id, userPending!.token, userIpAddress, userDeviceName)
            await prisma.userPending.update({ where: { phone: userPending!.phone }, data: { status: false } })
            res.status(200).json({
                message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
                user: userWithToken
            })
        }
    }

    // GET /users/:id
    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(400).json({ message: "id talab qilinadi" });
            const user = await userService.getById(id);
            if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // GET /users
    async getAll(req: Request, res: Response) {
        try {
            const {
                page,
                limit,
                search,
                isActive,
                isLoggedIn,
                rolesAny,
                rolesAll,
                createdFrom,
                createdTo,
                salaryMin,
                salaryMax,
                companyId,
                orderBy,
                sort,
            } = req.body;

            // helperlar
            const toBool = (v: any) =>
                typeof v === "string" ? (v.toLowerCase() === "true" ? true : v.toLowerCase() === "false" ? false : undefined) : undefined;

            const parseRoles = (v: any): Role[] | undefined => {
                if (!v) return undefined;
                if (Array.isArray(v)) return v as Role[];
                if (typeof v === "string") return v.split(",").map((s) => s.trim()) as Role[];
                return undefined;
            };

            const params = {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                search: (search as string) ?? undefined,
                isActive: toBool(isActive),
                isLoggedIn: toBool(isLoggedIn),
                rolesAny: parseRoles(rolesAny),
                rolesAll: parseRoles(rolesAll),
                createdFrom: (createdFrom as string) ?? undefined,
                createdTo: (createdTo as string) ?? undefined,
                salaryMin: salaryMin ? Number(salaryMin) : undefined,
                salaryMax: salaryMax ? Number(salaryMax) : undefined,
                companyId: companyId ? Number(companyId) : undefined,
                orderBy: (orderBy as "createdAt" | "updatedAt" | "firstName" | "lastName" | "nickname") ?? undefined,
                sort: (sort as "asc" | "desc") ?? undefined,
            };

            const result = await userService.getAll(params);
            res.json(result);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // GET /users/by-phone?phone=
    async findByPhone(req: Request, res: Response) {
        try {
            const phone = req.query.phone as string;
            if (!phone) return res.status(400).json({ message: "phone talab qilinadi" });
            const user = await userService.findByPhone(phone);
            if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // GET /users/by-nickname?nickname=
    async findByNickname(req: Request, res: Response) {
        try {
            const nickname = req.query.nickname as string;
            if (!nickname) return res.status(400).json({ message: "nickname talab qilinadi" });
            const user = await userService.findByNickname(nickname);
            if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // PATCH /users/:id/password
    async updatePassword(req: Request, res: Response) {
        try {
            const { id, password } = req.body;
            if (!id || !password) {
                return res.status(400).json({ message: "id va password talab qilinadi" });
            }
            const userExsist = await userService.findById(id)

            if (!userExsist) { res.status(404).json({ message: "Foydalanuvchi topilmadi" }) }
            else {
                const user = await userService.updatePassword(id, password);
                res.json(user);
            }

        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // PATCH /users/:id
    async edit(req: Request, res: Response) {
        try {

            const {
                id,
                firstName,
                lastName,
                middleName,
                secondPhone,
                bio,
                adress,
                emails,
                phones,
                salary,
            } = req.body;

            if (!id) return res.status(400).json({ message: "id talab qilinadi" });

            const user = await userService.edit(id, {
                firstName: firstName ?? null,
                lastName: lastName ?? null,
                middleName: middleName ?? null,
                secondPhone: secondPhone ?? null,
                bio: bio ?? null,
                adress: adress ?? null,
                emails,
                phones,
                salary: salary ?? null,
            });

            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // PATCH /users/:id/image
    async setImage(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { avatarUrl } = req.body;
            if (!id) return res.status(400).json({ message: "id talab qilinadi" });
            const user = await userService.setImage(id, avatarUrl ?? null);
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // PATCH /users/:id/active
    async setActive(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { isActive } = req.body;
            if (typeof isActive !== "boolean" || !id) {
                return res.status(400).json({ message: "id va isActive (boolean) talab qilinadi" });
            }
            const user = await userService.setActive(id, isActive);
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // PUT /users/:id/roles
    async setRoles(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { roles } = req.body as { roles: Role[] };
            if (!id || !Array.isArray(roles) || roles.length === 0) {
                return res.status(400).json({ message: "id va roles talab qilinadi" });
            }
            const user = await userService.setRoles(id, roles);
            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // POST /telegram/users
    // async createTelegramUser(req: Request, res: Response) {
    //     try {
    //         const { phone, code, name, username, chatId } = req.body;
    //         if (!phone || !code || !chatId) {
    //             return res.status(400).json({ message: "phone, code va chatId talab qilinadi" });
    //         }
    //         const tg = await userService.createTelegramUser(
    //             phone,
    //             Number(code),
    //             name ?? null,
    //             username ?? null,
    //             String(chatId)
    //         );
    //         res.status(201).json(tg);
    //     } catch (e) {
    //         console.error(e);
    //         res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }

    // // GET /telegram/users?code=
    // async getTelegramUser(req: Request, res: Response) {
    //     try {
    //         const code = Number(req.query.code);
    //         if (!code) return res.status(400).json({ message: "code talab qilinadi" });
    //         const list = await userService.getTelegramUser(code);
    //         res.json(list);
    //     } catch (e) {
    //         console.error(e);
    //         res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }

    // // POST /telegram/users/:id/deactivate
    // async deactiveTelegramUser(req: Request, res: Response) {
    //     try {
    //         const id = Number(req.params.id);
    //         if (!id) return res.status(400).json({ message: "id talab qilinadi" });
    //         const item = await userService.deactiveTelegramUser(id);
    //         res.json(item);
    //     } catch (e) {
    //         console.error(e);
    //         res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }
}