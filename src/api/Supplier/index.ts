import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AddSupplierDTO, SupplierHistoryDTO } from "./type";


export const supplierApi = {
  // ✅ Get supplier history
  useSupplierHistory: () => {
    return useQuery<SupplierHistoryDTO[], Error>({
      queryKey: ["supplier-history"],
      queryFn: async () => {
        const res = await axios.get(`Product/Supplierhistory`);
        return res.data.data;
      },
    });
  },

  // ✅ Add supplier
  useAddSupplier: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newSupplier: AddSupplierDTO) => {
        const res = await axios.post(`User/addsupplier?name=${newSupplier.name}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["supplier-history"] });
      },
    });
  },
};
