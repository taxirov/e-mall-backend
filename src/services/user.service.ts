import prisma from "../database";
import { Prisma, User, Role, UserTelegram } from "@prisma/client";
// import { UserServiceModel } from "../models/user.model";

// Public projection: hide password by default
const UserSelect = {
    orderAssignments: true,
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
} as const;

const PublicUserSelect = {
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
    activeToken: false,
    ipAddress: false,
    deviceName: false,
    createdAt: true,
    updatedAt: true,
    roles: true,
    userInCompanies: true
} as const;

export type PrivateUser = Prisma.UserGetPayload<{ select: typeof UserSelect }>
export type PublicUser = Prisma.UserGetPayload<{ select: typeof PublicUserSelect }>

export type Paginated<T> = {
    data: T[];
    meta: { total: number; page: number; limit: number; pages: number };
}

export type GetUsersParams = {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isLoggedIn?: boolean;
    rolesAny?: Role[];    // users that have ANY of these roles
    rolesAll?: Role[];    // users that have ALL of these roles
    createdFrom?: Date | string;
    createdTo?: Date | string;
    salaryMin?: number;
    salaryMax?: number;
    companyId?: number;   // filter by membership in a company
    orderBy?: "createdAt" | "updatedAt" | "firstName" | "lastName" | "nickname";
    sort?: "asc" | "desc";
}

export class UserService {
    async create(nickname: string, phone: string, password: string) {
        return await prisma.user.create({ data: { nickname, phone, password }, select: UserSelect })
    }
    async getById(id: number): Promise<PublicUser | null> {
        return await prisma.user.findUnique({ where: { id }, select: PublicUserSelect })
    }
    async setToken(id: number, activeToken: string, ipAddress: string | null, deviceName: string | null): Promise<PrivateUser> {
        return await prisma.user.update({
            where: { id },
            data: { activeToken, ipAddress, deviceName, isLoggedIn: true },
            select: UserSelect
        })
    }
    // async clearToken(id: number): Promise<User> {
    //     return await prisma.user.update({ where: { id }, data: { activeToken: null, ipAddress: null, deviceName: null, isLoggedIn: false } })
    // }
    async getAll(params: GetUsersParams = {}): Promise<Paginated<PublicUser>> {
        const page = Math.max(1, params.page ?? 1)
        const limit = Math.max(1, Math.min(100, params.limit ?? 20))
        const skip = (page - 1) * limit
        const orderByField = params.orderBy ?? "createdAt"
        const sort = params.sort ?? "desc"

        const where: Prisma.UserWhereInput = {}
        if (typeof params.isActive === 'boolean') where.isActive = params.isActive
        if (typeof params.isLoggedIn === 'boolean') where.isLoggedIn = params.isLoggedIn
        if (params.rolesAny && params.rolesAny.length) where.roles = { hasSome: params.rolesAny }
        if (params.rolesAll && params.rolesAll.length) where.roles = { ...(where.roles ?? {}), hasEvery: params.rolesAll }
        if (params.companyId) where.userInCompanies = { some: { companyId: params.companyId } }
        if (params.salaryMin !== undefined || params.salaryMax !== undefined) {
            where.salary = {}
            if (params.salaryMin !== undefined) where.salary.gte = params.salaryMin
            if (params.salaryMax !== undefined) where.salary.lte = params.salaryMax
        }
        if (params.createdFrom || params.createdTo) {
            where.createdAt = {}
            if (params.createdFrom) where.createdAt.gte = new Date(params.createdFrom)
            if (params.createdTo) where.createdAt.lte = new Date(params.createdTo)
        }
        if (params.search && params.search.trim()) {
            const q = params.search.trim()
            where.OR = [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { middleName: { contains: q, mode: 'insensitive' } },
                { nickname: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } }
            ]
        }

        const [total, data] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({ where, orderBy: { [orderByField]: sort }, skip, take: limit, select: PublicUserSelect })
        ])

        return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } }
    }
    async findByPhone(phone: string) {
        return await prisma.user.findUnique({ where: { phone }, select: PublicUserSelect })
    }
    async findById(id: number) {
        return await prisma.user.findUnique({ where: { id }, select: PublicUserSelect })
    }
    async findByNickname(nickname: string) {
        return await prisma.user.findUnique({ where: { nickname }, select: PublicUserSelect })
    }
    async findByNicknameWithPassword(nickname: string) {
        return await prisma.user.findUnique({ where: { nickname } })
    }
    async updatePassword(id: number, password: string) {
        return await prisma.user.update({ where: { id }, data: { password }, select: UserSelect })
    }
    async edit(id: number, data: {
        firstName?: string | null,
        lastName?: string | null,
        middleName?: string | null,
        secondPhone?: string | null,
        bio?: string | null,
        adress?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue,
        emails?: string[],
        phones?: string[],
        salary?: number | null
    }) {
        return await prisma.user.update({ where: { id }, data, select: UserSelect })
    }
    async setImage(id: number, avatarUrl: string | null) {
        return await prisma.user.update({ where: { id }, data: { avatarUrl } })
    }
    async setActive(id: number, isActive: boolean) {
        return await prisma.user.update({ where: { id }, data: { isActive } })
    }
    async setRoles(id: number, roles: Role[]) {
        return await prisma.user.update({ where: { id }, data: { roles: { set: roles } } })
    }
    // async createTelegramUser(phone: string, code: number, name: string | null, username: string | null, chatId: string) {
    //     return await prisma.userTelegram.create({ data: { phone, code, chatId, name, username } })
    // }
    // async getTelegramUser(code: number) {
    //     return await prisma.userTelegram.findMany({ where: { code, status: true } })
    // }
    // async deactiveTelegramUser(id: number) {
    //     return await prisma.userTelegram.update({ data: { status: false }, where: { id, status: true } })
    // }
}
