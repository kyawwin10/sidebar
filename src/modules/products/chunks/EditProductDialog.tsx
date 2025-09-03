// EditProductDialog.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import api from '@/api';
import { UpdateProductDTO } from '@/api/products/types';

interface ProductFormData {
  productId: string;
  catInstanceId: string;
  brandId: string;
  productName: string;
  productDescription: string;
  stockQTY: number;
  cost: number;
  price: number;
  productImageUrl: string;
}

interface EditProductDialogProps {
  editingProductId: string | null;
  onClose: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  editingProductId,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: product, isLoading: isProductLoading } = api.products.getProductById.useQuery(
    editingProductId || '',
  );
  const { data: brands = [], isLoading: isBrandsLoading } = api.products.getbrands.useQuery();
  const { data: categoryInstances = [], isLoading: isCategoriesLoading } = api.products.getCategoryInstances.useQuery();

  const uploadImageMutation = api.products.uploadImage.useMutation();
  const updateProductMutation = api.products.updateProduct.useMutation({
    onSuccess: () => {
      toast.success('Product updated successfully', {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error('Failed to update product', {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
      console.error('Error updating product:', error);
    },
  });

  const isLoading = isProductLoading || isBrandsLoading || isCategoriesLoading || uploadImageMutation.isPending || updateProductMutation.isPending;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      productId: '',
      catInstanceId: '',
      brandId: '',
      productName: '',
      productDescription: '',
      stockQTY: 0,
      cost: 0,
      price: 0,
      productImageUrl: '',
    },
  });

  const imagePreview = watch('productImageUrl');

  useEffect(() => {
    if (editingProductId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [editingProductId]);

  useEffect(() => {
    if (product && editingProductId) {
      setValue('productId', product.productId || '');
      setValue('catInstanceId', categoryInstances.find(cat => cat.catInstanceName === product.catInstanceName)?.catInstanceId || '');
      setValue('brandId', brands.find(brand => brand.brandName === product.brandName)?.brandId || '');
      setValue('productName', product.productName || '');
      setValue('productDescription', product.productDescription || '');
      setValue('stockQTY', product.stockQTY || 0);
      setValue('cost', product.cost || 0);
      setValue('price', product.price || 0);
      setValue('productImageUrl', product.productImageUrl || '');
    }
  }, [product, categoryInstances, brands, setValue, editingProductId]);

  const handleClose = () => {
    reset();
    setIsOpen(false);
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      const fullImageUrl = `https://localhost:7108/api/${result.url}`;
      setValue('productImageUrl', fullImageUrl);
      toast.success('Image uploaded successfully', {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
    } catch (error) {
      toast.error('Failed to upload image', {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
      console.error('Upload error:', error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const updateData: UpdateProductDTO = data;
    try {
      await updateProductMutation.mutateAsync(updateData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl backdrop-blur-md bg-white/20 border border-white/30">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('productId')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                {...register('productName', { required: 'Product name is required' })}
                placeholder="Enter product name"
                disabled={isLoading}
              />
              {errors.productName && (
                <p className="text-red-500 text-xs">{errors.productName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catInstanceId">Category</Label>
              <Select
                value={watch('catInstanceId')}
                onValueChange={(value) => setValue('catInstanceId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryInstances.map((catInstance) => (
                    <SelectItem
                      key={catInstance.catInstanceId}
                      value={catInstance.catInstanceId || ''}
                    >
                      {catInstance.catInstanceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.catInstanceId && (
                <p className="text-red-500 text-xs">{errors.catInstanceId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandId">Brand</Label>
              <Select
                value={watch('brandId')}
                onValueChange={(value) => setValue('brandId', value)}
                disabled={isLoading || brands.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={brands.length === 0 ? 'Loading brands...' : 'Select brand'} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem
                      key={brand.brandId}
                      value={brand.brandId || ''}
                    >
                      {brand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brandId && (
                <p className="text-red-500 text-xs">{errors.brandId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQTY">Stock Quantity</Label>
              <Input
                id="stockQTY"
                type="number"
                {...register('stockQTY', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.stockQTY && (
                <p className="text-red-500 text-xs">{errors.stockQTY.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Cost cannot be negative' }
                })}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.cost && (
                <p className="text-red-500 text-xs">{errors.cost.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              {...register('productDescription')}
              placeholder="Enter product description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={isLoading}
                />
              </div>
              {uploadImageMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>
            {imagePreview && (
              <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => setValue('productImageUrl', '')}
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="bg-white/30 backdrop-blur-md border-white/30 hover:bg-white/40"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;