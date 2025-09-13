export type CreateBranchDto = {
  name: string;
  desc?: string | null;
  address?: any;
  mainPhone?: string | null;
  phones?: string[];
  companyId: number;
};

export type UpdateBranchDto = Partial<CreateBranchDto>;

