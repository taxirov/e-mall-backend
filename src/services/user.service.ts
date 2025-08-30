import prisma from "../database";
import { UserServiceModel } from "../models/user.model";

export class UserService {
    async create(dto: { nickname: string, phone: string }) {
        return await prisma.user.create({
            data: {
                nickname: dto.nickname,
                phone: dto.phone
            }
        })
    }
    async setToken(dto: { phone: string, token: string }) {
        return await prisma.user.update({ where: { phone: dto.phone }, data: { activeToken: dto.token } })
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
        return await prisma.userTelegram.findMany({ where: { code, status: true }})
    }
    async deactiveTelegramUser(id: number) {
        return await prisma.userTelegram.update({ data: { status: false }, where: { id, status: true } })
    }
}