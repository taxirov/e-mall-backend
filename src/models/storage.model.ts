export type CreateStorageDto = {
  name: string;
  desc?: string | null;
  address?: any;
  mainPhone?: string | null;
  phones?: string[];
};

export type UpdateStorageDto = Partial<CreateStorageDto>;

