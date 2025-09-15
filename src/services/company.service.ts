import { PrismaClient, Prisma, Role, CompanyType } from "@prisma/client";

/**
 * CompanyService — high-level API around the `Company` domain.
 *
 * ✅ Features
 *  - Create/Read/Update/Delete (soft & hard) companies
 *  - Pagination + filtering + sorting
 *  - Branch management (parent ↔ branch)
 *  - Category linking via CategoryInCompany (add/remove/set)
 *  - User membership & role management via UserInCompany (add/remove/set/addRole/removeRole)
 *  - Defensive validation & helpful errors
 *  - Typed DTOs
 *
 * 🧩 Notes
 *  - This service expects the Prisma schema you shared (composite IDs, enums, etc.).
 *  - For `createMany({ skipDuplicates: true })` to work on CategoryInCompany, a unique constraint
 *    on (companyId, categoryId) is recommended. If you haven’t added it, we do a manual diff
 *    before inserting to avoid duplicates.
 */

// ────────────────────────────────────────────────────────────────────────────────
// DTOs & Types
// ────────────────────────────────────────────────────────────────────────────────

export interface AddressDTO {
  city?: string;
  zip?: string;
  street?: string;
  [k: string]: unknown;
}

export interface CreateCompanyDto {
  name: string;
  desc?: string;
  address?: AddressDTO | Prisma.InputJsonValue;
  mainPhone?: string;
  phones?: string[];
  bannerUrl?: string;
  logoUrl?: string;
  emails?: string[];
  websiteUrl?: string;
  type: CompanyType;
  isActive?: boolean;
  isBranch?: boolean;
  companyId?: number | null; // parent company id if branch
  // relations
  categoryIds?: number[]; // optional initial category links
}

export interface UpdateCompanyDto {
  name?: string;
  desc?: string | null;
  address?: AddressDTO | Prisma.InputJsonValue | null;
  mainPhone?: string | null;
  phones?: string[];
  bannerUrl?: string | null;
  logoUrl?: string | null;
  emails?: string[];
  websiteUrl?: string | null;
  type?: CompanyType;
  isActive?: boolean;
  isBranch?: boolean;
  companyId?: number | null;
}

export interface CompanyListFilter {
  q?: string; // search by name / phone / email
  type?: CompanyType;
  isActive?: boolean;
  isBranch?: boolean;
  parentCompanyId?: number; // list branches of a parent
}

export interface PaginationOpts {
  page?: number; // 1-based
  pageSize?: number; // default 20
}

export type CompanySortField = "createdAt" | "updatedAt" | "name" | "id";
export type SortDirection = "asc" | "desc";

export interface SortOpts {
  field?: CompanySortField;
  direction?: SortDirection;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

const normalizePhone = (s?: string | null) =>
  (s ?? "")
    .replace(/\s+/g, "")
    .replace(/[()\-]/g, "")
    .replace(/^\+998/, "998");

const normalizeManyPhones = (arr?: string[]) =>
  (arr ?? []).map(normalizePhone).filter(Boolean);

const isValidUrl = (u?: string | null) => {
  if (!u) return true;
  try {
    new URL(u);
    return true;
  } catch {
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
} satisfies Prisma.CompanyInclude;

// ────────────────────────────────────────────────────────────────────────────────
// Service
// ────────────────────────────────────────────────────────────────────────────────

export class CompanyService {
  constructor(private prisma: PrismaClient) {}

  // CREATE ──────────────────────────────────────────────────────────────────────
  async create(dto: CreateCompanyDto) {
    if (!dto.name?.trim()) throw new Error("Company name is required");
    if (!dto.type) throw new Error("Company type is required");
    if (!isValidUrl(dto.websiteUrl)) throw new Error("websiteUrl is not a valid URL");

    const data: Prisma.CompanyCreateInput = {
      name: dto.name.trim(),
      desc: dto.desc ?? undefined,
      address: dto.address as Prisma.InputJsonValue | undefined,
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
  async createByUser(userId: number, dto: CreateCompanyDto) {
    if (!userId) return this.create(dto);

    const created = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name.trim(),
          desc: dto.desc ?? undefined,
          address: dto.address as Prisma.InputJsonValue | undefined,
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
        const merged = Array.from(new Set([...(cur.roles ?? []), 'COMPANY_OWNER' as any]));
        await tx.user.update({ where: { id: userId }, data: { roles: { set: merged as any } } });
      }

      // Ensure membership
      await tx.userInCompany.upsert({
        where: { userId_companyId: { userId, companyId: company.id } },
        update: { roles: { set: ['COMPANY_OWNER'] as any } },
        create: { userId, companyId: company.id, roles: ['COMPANY_OWNER'] as any },
      });

      return tx.company.findUniqueOrThrow({ where: { id: company.id }, include: companyDefaultInclude });
    });

    return created;
  }

  // READ ────────────────────────────────────────────────────────────────────────
  async getById(id: number) {
    return this.prisma.company.findUnique({ where: { id }, include: companyDefaultInclude });
  }

  async list(filter: CompanyListFilter = {}, pagination: PaginationOpts = {}, sort: SortOpts = {}): Promise<Paginated<Prisma.CompanyGetPayload<{ include: typeof companyDefaultInclude }>>> {
    const page = Math.max(1, pagination.page ?? 1);
    const pageSize = Math.min(200, Math.max(1, pagination.pageSize ?? 20));

    const where: Prisma.CompanyWhereInput = {
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

    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [sort.field ?? "createdAt"]: sort.direction ?? "desc",
    } as Prisma.CompanyOrderByWithRelationInput;

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
  async update(id: number, dto: UpdateCompanyDto & { addCategoryIds?: number[]; removeCategoryIds?: number[]; setCategoryIds?: number[] }) {
    if (dto.websiteUrl !== undefined && !isValidUrl(dto.websiteUrl)) {
      throw new Error("websiteUrl is not a valid URL");
    }

    // Build update data
    const data: Prisma.CompanyUpdateInput = {
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
      } else {
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
  async softDelete(id: number) {
    return this.prisma.company.update({ where: { id }, data: { isActive: false } });
  }

  async restore(id: number) {
    return this.prisma.company.update({ where: { id }, data: { isActive: true } });
  }

  /**
   * Hard delete a company.
   * Be careful: this removes membership & category links first to avoid FK errors.
   */
  async hardDelete(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.userInCompany.deleteMany({ where: { companyId: id } });
      await tx.categoryInCompany.deleteMany({ where: { companyId: id } });
      // NOTE: If you later add other FKs to Company (e.g., ProductInStorage/companyId), delete them here first
      return tx.company.delete({ where: { id } });
    });
  }

  // BRANCHES ────────────────────────────────────────────────────────────────────
  async createBranch(parentCompanyId: number, dto: Omit<CreateCompanyDto, "companyId" | "isBranch">) {
    return this.create({ ...dto, isBranch: true, companyId: parentCompanyId });
  }

  async listBranches(parentCompanyId: number, pagination?: PaginationOpts, sort?: SortOpts) {
    return this.list({ parentCompanyId, isBranch: true }, pagination, sort);
  }

  // MEMBERSHIP & ROLES ─────────────────────────────────────────────────────────
  async addOrUpdateUser(companyId: number, userId: number, roles: Role[]) {
    // De-duplicate role array
    const uniqueRoles = Array.from(new Set(roles));
    return this.prisma.userInCompany.upsert({
      where: { userId_companyId: { userId, companyId } },
      update: { roles: uniqueRoles },
      create: { userId, companyId, roles: uniqueRoles },
    });
  }

  async removeUser(companyId: number, userId: number) {
    try {
      return await this.prisma.userInCompany.delete({ where: { userId_companyId: { userId, companyId } } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        // Not found — idempotent behavior
        return null;
      }
      throw e;
    }
  }

  async setUserRoles(companyId: number, userId: number, roles: Role[]) {
    const uniqueRoles = Array.from(new Set(roles));
    return this.prisma.userInCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { roles: uniqueRoles },
    });
  }

  async addUserRoles(companyId: number, userId: number, rolesToAdd: Role[]) {
    const current = await this.prisma.userInCompany.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!current) throw new Error("User is not a member of this company");
    const set = new Set([...(current.roles ?? []), ...rolesToAdd]);
    return this.prisma.userInCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { roles: Array.from(set) },
    });
  }

  async removeUserRoles(companyId: number, userId: number, rolesToRemove: Role[]) {
    const current = await this.prisma.userInCompany.findUnique({ where: { userId_companyId: { userId, companyId } } });
    if (!current) throw new Error("User is not a member of this company");
    const toRemove = new Set(rolesToRemove);
    const remain = (current.roles ?? []).filter((r) => !toRemove.has(r));
    return this.prisma.userInCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { roles: remain },
    });
  }

  async listMembers(companyId: number) {
    return this.prisma.userInCompany.findMany({
      where: { companyId },
      include: { user: { select: { id: true, firstName: true, lastName: true, nickname: true, phone: true } } },
      orderBy: { userId: "asc" },
    });
  }

  // CATEGORY LINKS ──────────────────────────────────────────────────────────────
  async addCategories(companyId: number, categoryIds: number[]) {
    if (!categoryIds?.length) return [];
    const existing = await this.prisma.categoryInCompany.findMany({ where: { companyId, categoryId: { in: categoryIds } }, select: { categoryId: true } });
    const existingIds = new Set(existing.map((e) => e.categoryId));
    const toInsert = categoryIds.filter((cid) => !existingIds.has(cid));
    if (!toInsert.length) return [];
    await this.prisma.categoryInCompany.createMany({ data: toInsert.map((categoryId) => ({ companyId, categoryId })) });
    return this.prisma.categoryInCompany.findMany({ where: { companyId, categoryId: { in: categoryIds } }, include: { category: true } });
  }

  async removeCategories(companyId: number, categoryIds: number[]) {
    if (!categoryIds?.length) return { count: 0 };
    return this.prisma.categoryInCompany.deleteMany({ where: { companyId, categoryId: { in: categoryIds } } });
  }

  async setCategories(companyId: number, categoryIds: number[]) {
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
  static mapPrismaError(e: unknown): Error {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const targets = (e.meta?.target as string[]) ?? [];
        if (targets.includes("name")) return new Error("Company name must be unique");
        return new Error(`Unique constraint failed on: ${targets.join(", ")}`);
      }
      if (e.code === "P2025") return new Error("Record not found");
    }
    return e as Error;
  }
}

// Example factory (optional):
export const makeCompanyService = (prisma?: PrismaClient) => new CompanyService(prisma ?? new PrismaClient());
