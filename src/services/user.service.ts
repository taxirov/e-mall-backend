import prisma from "../database";
// import { UserServiceModel } from "../models/user.model";

export class UserService {
    async create(nickname: string, phone: string, password: string) {
        return await prisma.user.create({ data: { nickname, phone, password } })
    }
    async setToken(id: number, activeToken: string, ipAddress: string | null, deviceName: string | null) {
        return await prisma.user.update(
            {
                where: { id },
                data: { activeToken, ipAddress, deviceName },
                select: {
                    orderAssignments: false,
                    password: false,
                    id: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    nickname: true,
                    phone: true,
                    secondPhone: true,
                    companyLimit: true,
                    salary: true,
                    avatarUrl: true,
                    bio: true,
                    adress: true,
                    emails: true,
                    phones: true,
                    isActive: true,
                    isLoggedIn: true,
                    activeToken: true,
                    ipAddress: true,
                    deviceName: true,
                    createdAt: true,
                    updatedAt: true,
                    roles: true,
                    userInCompanies: true
                }
            })
    }
    async findAll() {
        return await prisma.user.findMany()
    }
    async findByPhone(phone: string) {
        return await prisma.user.findUnique({ where: { phone } })
    }
    async findByNickname(nickname: string) {
        return await prisma.user.findUnique({ where: { nickname } })
    }
    async updatePassword(id: number, password: string) {
        return await prisma.user.update({ where: { id }, data: { password } })
    }
    async createTelegramUser(phone: string, code: number, name: string | null, username: string | null, chatId: string) {
        return await prisma.userTelegram.create({ data: { phone, code, chatId, name, username } })
    }
    async getTelegramUser(code: number) {
        return await prisma.userTelegram.findMany({ where: { code, status: true } })
    }
    async deactiveTelegramUser(id: number) {
        return await prisma.userTelegram.update({ data: { status: false }, where: { id, status: true } })
    }
}