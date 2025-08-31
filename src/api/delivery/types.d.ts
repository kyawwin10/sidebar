export interface Order {
  orderId: string | null;
  orderDate: string | null; // ISO string, you can convert to Date if needed
  orderPlace: string | null;
  orderStartPoint: string | null;
  orderEndPoint: string | null;
  totalAmount: number | null;
  totalQTY: number | null;
  totalProfit: number | null;
  totalCost: number | null;
  status: string | null;
  userName: string | null;
  deliveryName: string | null;
  paymentType: string | null;
  paymentAmount: number | null;
  deliFee: number | null;
  paymentStatus: string | null;
}
// types/delivery.ts

export interface OrderDetailWithVoucher {
  orderDetailId: string;
  productName: string;
  qty: number;
  price: number;
  discountAmount: number;
  finalPrice: number;
}

export interface OrderWithVoucherDTO {
  orderId: string;
  voucherCode: string | null;
  discountAmount: number;
  discountPercent: number;
  description: string;
  totalAmount: number;
  finalAmount: number;
  orderDetails: OrderDetailWithVoucher[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
