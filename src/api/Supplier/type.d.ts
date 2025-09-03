// Supplier Types
export interface Supplier {
  supplierId?: string;
  supplierName: string;
}

export interface SupplierHistoryDTO {
  supplierName: string;
  productCount: number;
}

export interface AddSupplierDTO {
  name: string;
}
