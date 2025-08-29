import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Order } from "./types";

export const useOrdersByStatus = (status: string) => {
  return useQuery<Order[], Error>({
    queryKey: ["orders", status],
    queryFn: async () => {
      const res = await axios.get(
        `https://localhost:7108/api/Order/all?status=${status}`
      );
      return res.data;
    },
  });
};
