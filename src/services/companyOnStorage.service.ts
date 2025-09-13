import prisma from "../database";
import { LinkCompanyStorageDto } from "../models/companyOnStorage.model";

export class CompanyOnStorageService {
  async link(dto: LinkCompanyStorageDto) {
    return prisma.companyOnStorage.upsert({
      where: { companyId_storageId: { companyId: dto.companyId, storageId: dto.storageId } },
      update: { isPrimary: dto.isPrimary ?? false },
      create: { companyId: dto.companyId, storageId: dto.storageId, isPrimary: dto.isPrimary ?? false },
    });
  }

  async unlink(companyId: number, storageId: number) {
    return prisma.companyOnStorage.delete({ where: { companyId_storageId: { companyId, storageId } } });
  }

  async listStorages(companyId: number) {
    return prisma.companyOnStorage.findMany({ where: { companyId }, include: { storage: true } });
  }

  async listCompanies(storageId: number) {
    return prisma.companyOnStorage.findMany({ where: { storageId }, include: { company: true } });
  }

  async setPrimary(companyId: number, storageId: number, isPrimary: boolean) {
    return prisma.companyOnStorage.update({ where: { companyId_storageId: { companyId, storageId } }, data: { isPrimary } });
  }
}

