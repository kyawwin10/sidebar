// api/products.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ProductType, 
  CategoryInstanceType, 
  AddProductDTO, 
  UpdateProductDTO, 
  UploadImageResponse,
  APIResponse,
  BrandType,
} from './types';

export const getProducts = {
  useQuery: (
    pageNumber: number = 1,
    pageSize: number = 10,
    language: string = 'us',
    opt?: UseQueryOptions<ProductType[], Error>
  ) => {
    return useQuery<ProductType[], Error>({
      queryKey: ['products', pageNumber, pageSize, language],
      queryFn: async () => {
        const response = await axios.get(`/Product`, {
          params: { pageNumber, pageSize, language },
        });
        return response.data.data;
      },
      ...opt,
    });
  },
};

export const getProductById = {
  useQuery: (
    productId: string,
    opt?: UseQueryOptions<ProductType, Error>
  ) => {
    return useQuery<ProductType, Error>({
      queryKey: ['product', productId],
      queryFn: async () => {
        const response = await axios.get(`/Product/${productId}`);
        return response.data.data;
      },
      enabled: !!productId,
      ...opt,
    });
  },
};

export const getCategoryInstances = {
  useQuery: (
    opt?: UseQueryOptions<CategoryInstanceType[], Error>
  ) => {
    return useQuery<CategoryInstanceType[], Error>({
      queryKey: ['categoryInstances'],
      queryFn: async () => {
        const response = await axios.get(`/Category/GetAllCategoryInstances`);
        return response.data.data;
      },
      ...opt,
    });
  },
};

export const getbrands = {
  useQuery: (
    opt?: UseQueryOptions<BrandType[], Error>
  ) => {
    return useQuery<BrandType[], Error>({
      queryKey: ['brands'],
      queryFn: async () => {
        const response = await axios.get(`/Category/GetAllBrands`);
        return response.data.data;
      },
      ...opt,
    });
  },
};

export const uploadImage = {
  useMutation: () => {
    return useMutation<UploadImageResponse, Error, File>({
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post('/Product/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      },
    });
  },
};

export const addProduct = {
  useMutation:  (options?:UseMutationOptions<APIResponse, Error, AddProductDTO>) => {
    return useMutation<APIResponse, Error, AddProductDTO>({
      mutationFn: async (productData: AddProductDTO) => {
        const response = await axios.post('/Product', productData);
        return response.data;
      },
      ...options, // pass options down
    });
  },
};

// export const updateProduct = {
//   useMutation: () => {
//     return useMutation<APIResponse, Error, UpdateProductDTO>({
//       mutationFn: async (productData: UpdateProductDTO) => {
//         const response = await axios.put('/Product', productData);
//         return response.data;
//       },
//     });
//   },
// };

export const updateProduct = {
  useMutation: (options?: UseMutationOptions<APIResponse, Error, UpdateProductDTO>) => {
    return useMutation<APIResponse, Error, UpdateProductDTO>({
      mutationFn: async (productData: UpdateProductDTO) => {
        const response = await axios.put('/Product', productData);
        return response.data;
      },
      ...options, // pass options down
    });
  },
};

export const deleteProduct = {
  useMutation: () => {
    return useMutation<APIResponse, Error, string>({
      mutationFn: async (productId: string) => {
        const response = await axios.delete(`/Product/${productId}`);
        return response.data;
      },
    });
  },
};