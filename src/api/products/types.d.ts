// types.ts
export type ProductType = {
  productId?: string;
  catInstanceName?: string;
  brandName?: string;
  productName?: string;
  productDescription?: string;
  stockQTY?: number;
  cost?: number;
  price?: number;
  currencySymbol?: string;
  productImageUrl?: string;
};

export type CategoryInstanceType = {
  catInstanceId?: string;
  catInstanceName?: string;
  products?: ProductSimpleType[];
};

export type ProductSimpleType = {
  productID?: string;
  productName?: string;
};

export type AddProductDTO = {
  catInstanceId?: string;
  brandId?: string;
  productName?: string;
  productDescription?: string;
  stockQTY?: number;
  cost?: number;
  price?: number;
  productImageUrl?: string;
};

export type UpdateProductDTO = {
  productId?: string;
  catInstanceId?: string;
  brandId?: string;
  productName?: string;
  productDescription?: string;
  stockQTY?: number;
  cost?: number;
  price?: number;
  productImageUrl?: string;
};

export type BrandType = {
  brandId?: string;
  brandName?: string;
};

export type UploadImageResponse = {
  url: string;
};
export type APIResponse = {
  success: boolean;
  message: string;
  data?: undefined ;
};