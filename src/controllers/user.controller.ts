import dotenv from 'dotenv';
dotenv.config()
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
// import TelegramBot, { Contact } from "node-telegram-bot-api";
import jwt from 'jsonwebtoken';
import prisma from '../database';


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
    async login(req: Request, res: Response) {
        try {
            const { nickname, password } = req.body;
            const userExsist = await userService.findByNickname(nickname);
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
                        const userDeviceName = (req.useragent?.os ? req.useragent?.os : null);
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
            res.status(500).json({
                message: "Error login user"
            })
        }
    }
}