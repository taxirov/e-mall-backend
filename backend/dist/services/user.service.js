"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = __importDefault(require("../database"));
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
};
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
};
class UserService {
    async create(nickname, phone, password) {
        return await database_1.default.user.create({ data: { nickname, phone, password }, select: UserSelect });
    }
    async getById(id) {
        return await database_1.default.user.findUnique({ where: { id }, select: PublicUserSelect });
    }
    async setToken(id, activeToken, ipAddress, deviceName) {
        return await database_1.default.user.update({
            where: { id },
            data: { activeToken, ipAddress, deviceName, isLoggedIn: true },
            select: UserSelect
        });
    }
    // async clearToken(id: number): Promise<User> {
    //     return await prisma.user.update({ where: { id }, data: { activeToken: null, ipAddress: null, deviceName: null, isLoggedIn: false } })
    // }
    async getAll(params = {}) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.max(1, Math.min(100, params.limit ?? 20));
        const skip = (page - 1) * limit;
        const orderByField = params.orderBy ?? "createdAt";
        const sort = params.sort ?? "desc";
        const where = {};
        if (typeof params.isActive === 'boolean')
            where.isActive = params.isActive;
        if (typeof params.isLoggedIn === 'boolean')
            where.isLoggedIn = params.isLoggedIn;
        if (params.rolesAny && params.rolesAny.length)
            where.roles = { hasSome: params.rolesAny };
        if (params.rolesAll && params.rolesAll.length)
            where.roles = { ...(where.roles ?? {}), hasEvery: params.rolesAll };
        if (params.companyId)
            where.userInCompanies = { some: { companyId: params.companyId } };
        if (params.salaryMin !== undefined || params.salaryMax !== undefined) {
            where.salary = {};
            if (params.salaryMin !== undefined)
                where.salary.gte = params.salaryMin;
            if (params.salaryMax !== undefined)
                where.salary.lte = params.salaryMax;
        }
        if (params.createdFrom || params.createdTo) {
            where.createdAt = {};
            if (params.createdFrom)
                where.createdAt.gte = new Date(params.createdFrom);
            if (params.createdTo)
                where.createdAt.lte = new Date(params.createdTo);
        }
        if (params.search && params.search.trim()) {
            const q = params.search.trim();
            where.OR = [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { middleName: { contains: q, mode: 'insensitive' } },
                { nickname: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } }
            ];
        }
        const [total, data] = await Promise.all([
            database_1.default.user.count({ where }),
            database_1.default.user.findMany({ where, orderBy: { [orderByField]: sort }, skip, take: limit, select: PublicUserSelect })
        ]);
        return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
    }
    async findByPhone(phone) {
        return await database_1.default.user.findUnique({ where: { phone }, select: PublicUserSelect });
    }
    async findById(id) {
        return await database_1.default.user.findUnique({ where: { id }, select: PublicUserSelect });
    }
    async findByNickname(nickname) {
        return await database_1.default.user.findUnique({ where: { nickname }, select: PublicUserSelect });
    }
    async findByNicknameWithPassword(nickname) {
        return await database_1.default.user.findUnique({ where: { nickname } });
    }
    async updatePassword(id, password) {
        return await database_1.default.user.update({ where: { id }, data: { password }, select: UserSelect });
    }
    async edit(id, data) {
        return await database_1.default.user.update({ where: { id }, data, select: UserSelect });
    }
    async setImage(id, avatarUrl) {
        return await database_1.default.user.update({ where: { id }, data: { avatarUrl } });
    }
    async setActive(id, isActive) {
        return await database_1.default.user.update({ where: { id }, data: { isActive } });
    }
    async setRoles(id, roles) {
        return await database_1.default.user.update({ where: { id }, data: { roles: { set: roles } } });
    }
}
exports.UserService = UserService;
