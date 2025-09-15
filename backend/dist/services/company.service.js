"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCompanyService = exports.CompanyService = void 0;
const client_1 = require("@prisma/client");
// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────
const normalizePhone = (s) => (s ?? "")
    .replace(/\s+/g, "")
    .replace(/[()\-]/g, "")
    .replace(/^\+998/, "998");
const normalizeManyPhones = (arr) => (arr ?? []).map(normalizePhone).filter(Boolean);
const isValidUrl = (u) => {
    if (!u)
        return true;
    try {
        new URL(u);
        return true;
    }
    catch {
        return false;
    }
};
const companyDefaultInclude = {
    categoryInCompanies: {
        include: { category: true },
    },
    userInCompanies: {
        include: { user: { select: { id: true, firstName: true, lastName: true, nickname: true, phone: true } } },
    },
    products: true,
};
// ────────────────────────────────────────────────────────────────────────────────
// Service
// ────────────────────────────────────────────────────────────────────────────────
class CompanyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // CREATE ──────────────────────────────────────────────────────────────────────
    async create(dto) {
        if (!dto.name?.trim())
            throw new Error("Company name is required");
        if (!dto.type)
            throw new Error("Company type is required");
        if (!isValidUrl(dto.websiteUrl))
            throw new Error("websiteUrl is not a valid URL");
        const data = {
            name: dto.name.trim(),
            desc: dto.desc ?? undefined,
            address: dto.address,
            mainPhone: normalizePhone(dto.mainPhone),
            phones: normalizeManyPhones(dto.phones),
            bannerUrl: dto.bannerUrl ?? undefined,
            logoUrl: dto.logoUrl ?? undefined,
            emails: dto.emails ?? [],
            websiteUrl: dto.websiteUrl ?? undefined,
            type: dto.type,
            isActive: dto.isActive ?? true,
            isBranch: dto.isBranch ?? false,
            companyId: dto.companyId ?? null,
        };
        const created = await this.prisma.$transaction(async (tx) => {
            const company = await tx.company.create({ data });
            if (dto.categoryIds?.length) {
                // Avoid duplicates manually (recommended to add unique index on [companyId, categoryId])
                const existing = await tx.categoryInCompany.findMany({
                    where: { companyId: company.id, categoryId: { in: dto.categoryIds } },
                    select: { categoryId: true },
                });
                const existingIds = new Set(existing.map((e) => e.categoryId));
                const toInsert = dto.categoryIds.filter((id) => !existingIds.has(id));
                if (toInsert.length) {
                    await tx.categoryInCompany.createMany({
                        data: toInsert.map((categoryId) => ({ companyId: company.id, categoryId })),
                    });
                }
            }
            return tx.company.findUniqueOrThrow({
                where: { id: company.id },
                include: companyDefaultInclude,
            });
        });
        return created;
    }
    /**
     * Create a company and ensure the creator becomes COMPANY_OWNER globally
     * and is linked to the new company as COMPANY_OWNER member.
     */
    async createByUser(userId, dto) {
        if (!userId)
            return this.create(dto);
        const created = await this.prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: dto.name.trim(),
                    desc: dto.desc ?? undefined,
                    address: dto.address,
                    mainPhone: normalizePhone(dto.mainPhone),
                    phones: normalizeManyPhones(dto.phones),
                    bannerUrl: dto.bannerUrl ?? undefined,
                    logoUrl: dto.logoUrl ?? undefined,
                    emails: dto.emails ?? [],
                    websiteUrl: dto.websiteUrl ?? undefined,
                    type: dto.type,
                    isActive: dto.isActive ?? true,
                    isBranch: dto.isBranch ?? false,
                    companyId: dto.companyId ?? null,
                },
            });
            if (dto.categoryIds?.length) {
                const existing = await tx.categoryInCompany.findMany({
                    where: { companyId: company.id, categoryId: { in: dto.categoryIds } },
                    select: { categoryId: true },
                });
                const existingIds = new Set(existing.map((e) => e.categoryId));
                const toInsert = dto.categoryIds.filter((id) => !existingIds.has(id));
                if (toInsert.length) {
                    await tx.categoryInCompany.createMany({
                        data: toInsert.map((categoryId) => ({ companyId: company.id, categoryId })),
                    });
                }
            }
            // Ensure COMPANY_OWNER in global roles
            const cur = await tx.user.findUnique({ where: { id: userId }, select: { roles: true } });
            if (cur) {
                const merged = Array.from(new Set([...(cur.roles ?? []), 'COMPANY_OWNER']));
                await tx.user.update({ where: { id: userId }, data: { roles: { set: merged } } });
            }
            // Ensure membership
            await tx.userInCompany.upsert({
                where: { userId_companyId: { userId, companyId: company.id } },
                update: { roles: { set: ['COMPANY_OWNER'] } },
                create: { userId, companyId: company.id, roles: ['COMPANY_OWNER'] },
            });
            return tx.company.findUniqueOrThrow({ where: { id: company.id }, include: companyDefaultInclude });
        });
        return created;
    }
    // READ ────────────────────────────────────────────────────────────────────────
    async getById(id) {
        return this.prisma.company.findUnique({ where: { id }, include: companyDefaultInclude });
    }
    async list(filter = {}, pagination = {}, sort = {}) {
        const page = Math.max(1, pagination.page ?? 1);
        const pageSize = Math.min(200, Math.max(1, pagination.pageSize ?? 20));
        const where = {
            AND: [
                filter.type ? { type: filter.type } : {},
                typeof filter.isActive === "boolean" ? { isActive: filter.isActive } : {},
                typeof filter.isBranch === "boolean" ? { isBranch: filter.isBranch } : {},
                filter.parentCompanyId != null ? { companyId: filter.parentCompanyId } : {},
                filter.q
                    ? {
                        OR: [
                            { name: { contains: filter.q, mode: "insensitive" } },
                            { mainPhone: { contains: normalizePhone(filter.q), mode: "insensitive" } },
                            { phones: { has: normalizePhone(filter.q) } },
                            { emails: { has: filter.q.toLowerCase() } },
                        ],
                    }
                    : {},
            ],
        };
        const orderBy = {
            [sort.field ?? "createdAt"]: sort.direction ?? "desc",
        };
        const [total, data] = await this.prisma.$transaction([
            this.prisma.company.count({ where }),
            this.prisma.company.findMany({
                where,
                include: companyDefaultInclude,
                orderBy,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        return {
            data,
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }
    // UPDATE ──────────────────────────────────────────────────────────────────────
    async update(id, dto) {
        if (dto.websiteUrl !== undefined && !isValidUrl(dto.websiteUrl)) {
            throw new Error("websiteUrl is not a valid URL");
        }
        // Build update data
        const data = {
            name: dto.name?.trim(),
            desc: dto.desc === undefined ? undefined : dto.desc,
            mainPhone: dto.mainPhone === undefined ? undefined : normalizePhone(dto.mainPhone),
            phones: dto.phones === undefined ? undefined : normalizeManyPhones(dto.phones),
            bannerUrl: dto.bannerUrl === undefined ? undefined : dto.bannerUrl,
            logoUrl: dto.logoUrl === undefined ? undefined : dto.logoUrl,
            emails: dto.emails === undefined ? undefined : dto.emails,
            websiteUrl: dto.websiteUrl === undefined ? undefined : dto.websiteUrl,
            type: dto.type === undefined ? undefined : dto.type,
            isActive: dto.isActive === undefined ? undefined : dto.isActive,
            isBranch: dto.isBranch === undefined ? undefined : dto.isBranch,
            companyId: dto.companyId === undefined ? undefined : dto.companyId,
        };
        const updated = await this.prisma.$transaction(async (tx) => {
            const company = await tx.company.update({ where: { id }, data });
            // Category operations (mutually exclusive: prefer setCategoryIds if provided)
            if (dto.setCategoryIds) {
                const current = await tx.categoryInCompany.findMany({ where: { companyId: id } });
                const currentSet = new Set(current.map((c) => c.categoryId));
                const targetSet = new Set(dto.setCategoryIds);
                const toRemove = [...currentSet].filter((c) => !targetSet.has(c));
                const toAdd = [...targetSet].filter((c) => !currentSet.has(c));
                if (toRemove.length) {
                    await tx.categoryInCompany.deleteMany({ where: { companyId: id, categoryId: { in: toRemove } } });
                }
                if (toAdd.length) {
                    await tx.categoryInCompany.createMany({ data: toAdd.map((categoryId) => ({ companyId: id, categoryId })) });
                }
            }
            else {
                if (dto.removeCategoryIds?.length) {
                    await tx.categoryInCompany.deleteMany({ where: { companyId: id, categoryId: { in: dto.removeCategoryIds } } });
                }
                if (dto.addCategoryIds?.length) {
                    // avoid dupes
                    const existing = await tx.categoryInCompany.findMany({
                        where: { companyId: id, categoryId: { in: dto.addCategoryIds } },
                        select: { categoryId: true },
                    });
                    const existingIds = new Set(existing.map((e) => e.categoryId));
                    const toInsert = dto.addCategoryIds.filter((cid) => !existingIds.has(cid));
                    if (toInsert.length) {
                        await tx.categoryInCompany.createMany({ data: toInsert.map((categoryId) => ({ companyId: id, categoryId })) });
                    }
                }
            }
            return tx.company.findUniqueOrThrow({ where: { id: company.id }, include: companyDefaultInclude });
        });
        return updated;
    }
    // DELETE (soft/hard) ──────────────────────────────────────────────────────────
    async softDelete(id) {
        return this.prisma.company.update({ where: { id }, data: { isActive: false } });
    }
    async restore(id) {
        return this.prisma.company.update({ where: { id }, data: { isActive: true } });
    }
    /**
     * Hard delete a company.
     * Be careful: this removes membership & category links first to avoid FK errors.
     */
    async hardDelete(id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.userInCompany.deleteMany({ where: { companyId: id } });
            await tx.categoryInCompany.deleteMany({ where: { companyId: id } });
            // NOTE: If you later add other FKs to Company (e.g., ProductInStorage/companyId), delete them here first
            return tx.company.delete({ where: { id } });
        });
    }
    // BRANCHES ────────────────────────────────────────────────────────────────────
    async createBranch(parentCompanyId, dto) {
        return this.create({ ...dto, isBranch: true, companyId: parentCompanyId });
    }
    async listBranches(parentCompanyId, pagination, sort) {
        return this.list({ parentCompanyId, isBranch: true }, pagination, sort);
    }
    // MEMBERSHIP & ROLES ─────────────────────────────────────────────────────────
    async addOrUpdateUser(companyId, userId, roles) {
        // De-duplicate role array
        const uniqueRoles = Array.from(new Set(roles));
        return this.prisma.userInCompany.upsert({
            where: { userId_companyId: { userId, companyId } },
            update: { roles: uniqueRoles },
            create: { userId, companyId, roles: uniqueRoles },
        });
    }
    async removeUser(companyId, userId) {
        try {
            return await this.prisma.userInCompany.delete({ where: { userId_companyId: { userId, companyId } } });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
                // Not found — idempotent behavior
                return null;
            }
            throw e;
        }
    }
    async setUserRoles(companyId, userId, roles) {
        const uniqueRoles = Array.from(new Set(roles));
        return this.prisma.userInCompany.update({
            where: { userId_companyId: { userId, companyId } },
            data: { roles: uniqueRoles },
        });
    }
    async addUserRoles(companyId, userId, rolesToAdd) {
        const current = await this.prisma.userInCompany.findUnique({ where: { userId_companyId: { userId, companyId } } });
        if (!current)
            throw new Error("User is not a member of this company");
        const set = new Set([...(current.roles ?? []), ...rolesToAdd]);
        return this.prisma.userInCompany.update({
            where: { userId_companyId: { userId, companyId } },
            data: { roles: Array.from(set) },
        });
    }
    async removeUserRoles(companyId, userId, rolesToRemove) {
        const current = await this.prisma.userInCompany.findUnique({ where: { userId_companyId: { userId, companyId } } });
        if (!current)
            throw new Error("User is not a member of this company");
        const toRemove = new Set(rolesToRemove);
        const remain = (current.roles ?? []).filter((r) => !toRemove.has(r));
        return this.prisma.userInCompany.update({
            where: { userId_companyId: { userId, companyId } },
            data: { roles: remain },
        });
    }
    async listMembers(companyId) {
        return this.prisma.userInCompany.findMany({
            where: { companyId },
            include: { user: { select: { id: true, firstName: true, lastName: true, nickname: true, phone: true } } },
            orderBy: { userId: "asc" },
        });
    }
    // CATEGORY LINKS ──────────────────────────────────────────────────────────────
    async addCategories(companyId, categoryIds) {
        if (!categoryIds?.length)
            return [];
        const existing = await this.prisma.categoryInCompany.findMany({ where: { companyId, categoryId: { in: categoryIds } }, select: { categoryId: true } });
        const existingIds = new Set(existing.map((e) => e.categoryId));
        const toInsert = categoryIds.filter((cid) => !existingIds.has(cid));
        if (!toInsert.length)
            return [];
        await this.prisma.categoryInCompany.createMany({ data: toInsert.map((categoryId) => ({ companyId, categoryId })) });
        return this.prisma.categoryInCompany.findMany({ where: { companyId, categoryId: { in: categoryIds } }, include: { category: true } });
    }
    async removeCategories(companyId, categoryIds) {
        if (!categoryIds?.length)
            return { count: 0 };
        return this.prisma.categoryInCompany.deleteMany({ where: { companyId, categoryId: { in: categoryIds } } });
    }
    async setCategories(companyId, categoryIds) {
        return this.prisma.$transaction(async (tx) => {
            await tx.categoryInCompany.deleteMany({ where: { companyId } });
            if (categoryIds?.length) {
                await tx.categoryInCompany.createMany({ data: categoryIds.map((categoryId) => ({ companyId, categoryId })) });
            }
            return tx.company.findUniqueOrThrow({ where: { id: companyId }, include: companyDefaultInclude });
        });
    }
    // UTIL ────────────────────────────────────────────────────────────────────────
    /** Map Prisma unique constraint errors to human-friendly messages */
    static mapPrismaError(e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                const targets = e.meta?.target ?? [];
                if (targets.includes("name"))
                    return new Error("Company name must be unique");
                return new Error(`Unique constraint failed on: ${targets.join(", ")}`);
            }
            if (e.code === "P2025")
                return new Error("Record not found");
        }
        return e;
    }
}
exports.CompanyService = CompanyService;
// Example factory (optional):
const makeCompanyService = (prisma) => new CompanyService(prisma ?? new client_1.PrismaClient());
exports.makeCompanyService = makeCompanyService;
