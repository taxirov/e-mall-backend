import dotenv from 'dotenv';
dotenv.config()
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import axios from 'axios';
import { Role } from "@prisma/client"
import TelegramBot, { Contact } from "node-telegram-bot-api";
import jwt from 'jsonwebtoken';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// 1. /start bosilganda tugma yuboramiz
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Telefon raqamingizni yuboring:", {
        reply_markup: {
            keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    });
});

// 2. Telefon raqam kelganda
bot.on("contact", async (msg) => {
    const contact = msg.contact;
    const chatId = msg.chat.id;

    const phone = contact!.phone_number;
    const name = contact!.first_name;
    const username = msg.from?.username || null;

    // 6 xonali kod yaratamiz
    const code = Math.floor(100000 + Math.random() * 900000);

    // Kodni DB yoki cache (Redis) da vaqtinchalik saqlash
    await userService.createTelegramUser(phone, code, name, username, String(chatId))

    // Kodni yuborish
    bot.sendMessage(chatId, `Tasdiqlash kodingiz: ${code}`);
});

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

function generateOTP(length: number = 4): string {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10); // 0-9 oralig‘ida son
    }
    return otp;
}

const userService = new UserService();

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const { nickname, password, phone } = req.body;
            const userCheckByPhone = await userService.findByPhone(phone)
            const userCheckByNickname = await userService.findByPhone(nickname)
            if (userCheckByNickname) {
                res.status(409).json({ message: "User already exsist with this: " + nickname + " nickname!" })
            } if (userCheckByPhone) {
                res.status(409).json({ message: "User already exsist with this: " + phone + " phone!" })
            } else {
                res.locals.pendingUser = { nickname, password, phone }
                const otp = generateOTP(4)
                res.locals.otp = otp;
                res.locals.otpExpire = Date.now() + 2 * 60 * 1000; // 2 daqiqa amal qiladi
                let messageData = {
                    mobile_phone: '998' + phone,
                    message: "E-mall tizimidan ro'yhatdan o'tish uchun kodingiz: " + otp,
                    from: '4546'
                }

                await axios.post('https://notify.eskiz.uz/api/message/sms/send', messageData, { headers: { Authorization: 'Bearer ' + process.env.SMS_TOKEN } })
                const token = jwt.sign({ nickname, phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                await userService.setToken({ phone, token })
                res.status(200).json({
                    message: "Tasdiqlash kodi jo'natildi",
                    token
                })
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    async registerVerify(req: Request, res: Response) {
        const { otp } = req.body;

        if (!res.locals.otp || !res.locals.pendingUser) {
            return res.status(400).json({ error: "Hech qanday pending user topilmadi" });
        }

        if (res.locals.otpExpire < Date.now()) {
            return res.status(400).json({ error: "Kod muddati tugagan" });
        }

        if (otp !== res.locals.otp) {
            return res.status(400).json({ error: "Kod xato" });
        }

        const user = res.locals.pendingUser;
        const userCreated = await userService.create(user)

        res.status(200).json({
            message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
            userCreated,
            token: userCreated.activeToken
        })
    }
    async telegramVerify(req: Request, res: Response) {
        try {
            const { code } = req.body;
            const userPending = (await userService.getTelegramUser(code))[0]
            if (userPending) {
                if (userPending.username) {
                    const userCreated = await userService.create({ nickname: userPending.username, phone: userPending.phone })
                    const token = jwt.sign({ nickname: userPending.username, phone: userPending.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                    const userWithToken = await userService.setToken({ phone: userCreated.phone, token })
                    await userService.deactiveTelegramUser(userPending.id)
                    res.status(200).json({
                        message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
                        userWithToken
                    })
                } else {
                    const userCreated = await userService.create({ nickname: `u${userPending.phone}`, phone: userPending.phone })
                    const token = jwt.sign({ nickname: userCreated.nickname, phone: userCreated.phone }, process.env.SECRET_KEY!, { expiresIn: "7d" })
                    const userWithToken = await userService.setToken({ phone: userCreated.phone, token })
                    await userService.deactiveTelegramUser(userPending.id)
                    res.status(200).json({
                        message: "Ro'yhatdan o'tish muvafaqqiyatli yakunlandi!",
                        userWithToken
                    })
                }

            } else {
                res.status(403).json({
                    message: "Kod eskirgan"
                })
            }
        } catch (error) { }
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