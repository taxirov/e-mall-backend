import prisma from "../database";
import { UserServiceModel } from "../models/user.model";

export class UserService {
    async create(dto: {nickname: string, password: string, phone: string}) {
        return await prisma.user.create({
            data: {
                nickname: dto.nickname,
                password: dto.password,
                phone: dto.phone
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
        return await prisma.user.update({ where: { id }, data: { password }})
    }

}