// api/category.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AddBrandDTO, AddCategoryDTO, Brand, Category, CategoryInstance } from "./types";

const BASE_URL = "https://localhost:7108/api/Category";

export const categoryApi = {
  // ✅ Get all brands
  useBrands: () => {
    return useQuery<Brand[], Error>({
      queryKey: ["brands"],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/GetAllBrands`);
        return res.data.data;
      },
    });
  },

  // ✅ Get all categories
  useCategories: () => {
    return useQuery<Category[], Error>({
      queryKey: ["categories"],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/all`);
        return res.data.data;
      },
    });
  },

  // ✅ Get category instances
  useCategoryInstances: (catId: string) => {
    return useQuery<CategoryInstance[], Error>({
      queryKey: ["category-instances", catId],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/instances/${catId}`);
        return res.data.data;
      },
      enabled: !!catId,
    });
  },

  // ✅ Add brand
  useAddBrand: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newBrand: AddBrandDTO) => {
        const res = await axios.post(`${BASE_URL}/add-brand`, newBrand);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brands"] });
      },
    });
  },

  // ✅ Add category with instances
  useAddCategory: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newCategory: AddCategoryDTO) => {
        const res = await axios.post(`${BASE_URL}/add-with-instances`, newCategory);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
    });
  },
};
