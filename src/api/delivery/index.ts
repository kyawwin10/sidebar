import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse, Order, OrderWithVoucherDTO } from "./types";

// ✅ Get Orders by Status ("ordered")
export const useOrdersByStatus = (status: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", status],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<Order[]>>(
        `https://localhost:7108/api/Order/all?status=${status}`
      );
      return res.data.data;
    },
  });
};

// ✅ Get All Orders (Delivered list, role-filtered)
export const useAllOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<Order[]>>(
        `https://localhost:7108/api/Order/allwithuserid`
      );
      return res.data.data;
    },
  });
};

// ✅ Get Voucher by Order ID
export const useVoucherByOrderId = (orderId: string) => {
  return useQuery<OrderWithVoucherDTO, Error>({
    queryKey: ["voucher", orderId],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<OrderWithVoucherDTO>>(
        `https://localhost:7108/api/Order/getvoucher/${orderId}`
      );
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

// ✅ Accept Order (Delivery access)
export const useAcceptOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await axios.post(
        `https://localhost:7108/api/Order/delivery-access?orderId=${orderId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "ordered"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
    },
  });
};

// ✅ Complete Order
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await axios.post(
        `https://localhost:7108/api/Order/complete/${orderId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
    },
  });
};

// ✅ Reject Order
export const useRejectOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await axios.post(
        `https://localhost:7108/api/Order/reject/${orderId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
    },
  });
};
