import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

type LoginDTO = { email: string; password: string };
type ForgotPasswordDTO = { email: string };
type LoginResponse = { token: string; userName: string; roleName: string };

export const login = {
  useMutation: (
    opt?: Partial<UseMutationOptions<LoginResponse, Error, LoginDTO>>
  ) =>
    useMutation<LoginResponse, Error, LoginDTO>({
      mutationFn: async (dto) => {
        const res = await axios.post("/User/login", dto);
        return res.data;
      },
      ...opt,
    }),
};

export const forgotPassword = {
  useMutation: (
    opt?: Partial<UseMutationOptions<boolean, Error, ForgotPasswordDTO>>
  ) =>
    useMutation<boolean, Error, ForgotPasswordDTO>({
      mutationFn: async (dto) => {
        const res = await axios.post("/User/forgot-password", dto);
        return res.data;
      },
      ...opt,
    }),
};

