import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse, Order, OrderWithVoucherDTO } from "./types";

export const useOrdersByStatus = (status: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", status],
    queryFn: async () => {
      const res = await axios.get(
        `https://localhost:7108/api/Order/all?status=${status}`
      );
      return res.data.data;
    },
  });
};
export const useVoucherByOrderId = (orderId: string) => {
  return useQuery<OrderWithVoucherDTO, Error>({
    queryKey: ["voucher", orderId],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<OrderWithVoucherDTO>>(
        `https://localhost:7108/api/Order/getvoucher/${orderId}`
      );
      return res.data.data; // return the voucher DTO
    },
    enabled: !!orderId, // only fetch if orderId is provided
  });
};