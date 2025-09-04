import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

import { AddUserDTO, UserDTO } from "./type";
import axios from "axios";

export const userApi = {
    getUser: async (userId: string): Promise<UserDTO> => {
    const res = await axios.get(`/User/${userId}`);
    return res.data;
  },
  // ✅ Get all users
  useQuery: (opt?: UseQueryOptions<UserDTO[], Error>) => {
    return useQuery<UserDTO[], Error>({
      queryKey: ["users"],
      queryFn: async () => {
        const res = await axios.get("/User"); // Base URL already set
        return res.data;
      },
      ...opt,
    });
  },

  // ✅ Add new user
  useAdd: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newUser: AddUserDTO) => {
        const res = await axios.post("User/register", newUser);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  },
};
