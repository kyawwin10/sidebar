// types/category.ts

export interface Brand {
  brandId?: string;
  brandName: string;
}

export interface AddBrandDTO {
  brandName: string;
}

export interface Category {
  catId?: string;
  catName: string;
}

export interface AddCategoryDTO {
  catName: string;
  instanceNames: string[];
}

export interface CategoryInstance {
  catInstanceId?: string;
  catId?: string;
  catInstanceName: string;
}
