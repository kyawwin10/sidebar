import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Package, Plus, Boxes, Loader2, Image as ImageIcon, Search, X } from 'lucide-react';

import api from '@/api';
import { ProductType, UpdateProductDTO } from '@/api/products/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ProductActionMenu } from './chunks/ActionMenu';
import { AddProductDialog } from './chunks/AddProductDialog';

const BASE_URL = 'https://localhost:7108/api/';

interface ProductFormData {
  catInstanceId: string;
  brandId: string;
  productName: string;
  productDescription: string;
  stockQTY: number;
  cost: number;
  price: number;
  productImageUrl: string;
}

const ProductsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductType | null>(null);

  const pageSize = 20;
  const queryClient = useQueryClient();

  // Queries
  const productsQuery = api.products.getProducts.useQuery(pageNumber, pageSize, 'us');
  const categoryInstancesQuery = api.products.getCategoryInstances.useQuery();
  const { data: product, isLoading: isProductLoading } = api.products.getProductById.useQuery(editingProductId || '');
  const { data: brands = [], isLoading: isBrandsLoading } = api.products.getbrands.useQuery();
  const { data: categoryInstances = [], isLoading: isCategoriesLoading } = api.products.getCategoryInstances.useQuery();

  // Mutations
  const deleteProductMutation = api.products.deleteProduct.useMutation();
  const uploadImageMutation = api.products.uploadImage.useMutation();
  const updateProductMutation = api.products.updateProduct.useMutation({
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      handleEditDialogClose();
    },
    onError: (error: Error) => {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    },
  });

  const isLoading = isProductLoading || isBrandsLoading || isCategoriesLoading || uploadImageMutation.isPending || updateProductMutation.isPending;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
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

  // Initialize form data when dialog opens or product data is fetched
  useEffect(() => {
    if (isEditProductDialogOpen && product && categoryInstances.length > 0 && brands.length > 0) {
      const selectedCategory = categoryInstances.find(
        (cat) => cat.catInstanceName === product.catInstanceName
      );
      const selectedBrand = brands.find(
        (brand) => brand.brandName === product.brandName
      );

      reset({
        catInstanceId: selectedCategory?.catInstanceId || '',
        brandId: selectedBrand?.brandId || '',
        productName: product.productName || '',
        productDescription: product.productDescription || '',
        stockQTY: product.stockQTY || 0,
        cost: product.cost || 0,
        price: product.price || 0,
        productImageUrl: product.productImageUrl || '',
      });
    }
  }, [isEditProductDialogOpen, product, categoryInstances, brands, reset]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isEditProductDialogOpen) {
      reset();
    }
  }, [isEditProductDialogOpen, reset]);

  // Filter products based on search term
  const filteredProducts = productsQuery.data?.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.catInstanceName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddProduct = () => {
    setEditingProductId(null);
    setIsAddProductDialogOpen(true);
  };

  const handleEditProduct = (product: ProductType) => {
    setEditingProductId(product.productId || null);
    setIsEditProductDialogOpen(true);
  };

  const handleDeleteProduct = (product: ProductType) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct?.productId) return;

    try {
      await deleteProductMutation.mutateAsync(deletingProduct.productId);
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete error:', error);
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleAddDialogClose = () => {
    setIsAddProductDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditProductDialogOpen(false);
    setEditingProductId(null);
    reset();
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      const fullImageUrl = `${BASE_URL}${result.url}`;
      setValue('productImageUrl', fullImageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!editingProductId) {
      toast.error('No product selected for editing');
      return;
    }

    const updateData: UpdateProductDTO = {
      productId: editingProductId,
      ...data,
    };
    
    updateProductMutation.mutate(updateData);
  };

  // Calculate total value and low stock products
  const totalProducts = productsQuery.data?.length || 0;
  const totalValue = productsQuery.data?.reduce((sum, product) => 
    sum + ((product.price || 0) * (product.stockQTY || 0)), 0
  ) || 0;
  const lowStockProducts = productsQuery.data?.filter(product => 
    (product.stockQTY || 0) < 10
  ).length || 0;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Products Management
            </h1>
            <p className="text-sm">
              Manage your products efficiently from here.
            </p>
          </div>
        </div>
        <div className="backdrop-blur-md bg-white/10 rounded-lg shadow-lg p-2 flex items-center gap-4">
          <Search className="absolute h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-2 ml-5 pr-16 py-2 rounded-lg text-sm bg-muted border border-border"
          />
          <Button 
            onClick={handleAddProduct} 
            className=""
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Metrics Section */}
      {productsQuery.isLoading ? (
        <div className="grid mt-9 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="shadow-lg rounded-xl">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Boxes className="w-4 h-4" />
                Total Products
              </div>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30">
            <CardContent className="p-6">
              <div className="text-sm font-medium mb-2">
                Total Value
              </div>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30">
            <CardContent className="p-6">
              <div className="text-sm font-medium mb-2">
                Low Stock
              </div>
              <div className="text-2xl font-bold text-orange-400">{lowStockProducts}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30">
            <CardContent className="p-6">
              <div className="text-sm font-medium mb-2">
                Categories
              </div>
              <div className="text-2xl font-bold">
                {categoryInstancesQuery.data?.length || '—'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Grid */}
      <Card className="backdrop-blur-md mt-9 bg-white/10 shadow-lg rounded-xl border border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productsQuery.isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: pageSize }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30">
                  <div className="aspect-square">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="mb-4">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first product.'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={handleAddProduct}
                  className=""
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.productId} 
                  className="overflow-hidden backdrop-blur-md bg-white/20 shadow-lg rounded-xl border border-white/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square relative bg-black/10">
                    {product.productImageUrl ? (
                      <img
                        src={product.productImageUrl.startsWith('http') 
                          ? product.productImageUrl 
                          : `${BASE_URL}${product.productImageUrl}`}
                        alt={product.productName}
                        className="w-full h-full object-cover rounded-t-xl"
                        onError={() => toast.error(`Failed to load image for ${product.productName}`)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    {(product.stockQTY || 0) < 10 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 left-2 bg-red-500 text-white z-10"
                      >
                        Low Stock
                      </Badge>
                    )}
                    <div className="absolute bg-white rounded-2xl top-2 right-2 z-10">
                      <ProductActionMenu
                        onEdit={() => handleEditProduct(product)}
                        onDelete={() => handleDeleteProduct(product)}
                      />
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {product.productName}
                      </h3>
                      <p className="text-xs">
                        {product.brandName || 'No Brand'} • {product.catInstanceName || 'No Category'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Price:</span>
                        <span className="text-sm font-medium">
                          {product.currencySymbol}{product.price?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Stock:</span>
                        <span className={`text-sm font-medium ${
                          (product.stockQTY || 0) < 10 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {product.stockQTY || 0}
                        </span>
                      </div>
                      {product.cost && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Cost:</span>
                          <span className="text-xs">
                            {product.currencySymbol}{product.cost.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    {product.productDescription && (
                      <p className="text-xs line-clamp-2 pt-1 border-t border-white/20">
                        {product.productDescription}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        {!productsQuery.isLoading && filteredProducts.length > 0 && (
          <CardContent className="flex items-center justify-between pt-6 border-t border-white/20">
            <Button
              variant="outline"
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              className="bg-white/30 backdrop-blur-md border-white/30 hover:bg-white/40"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Page {pageNumber}</span>
              <span className="text-sm">•</span>
              <span className="text-sm">
                Showing {filteredProducts.length} of {totalProducts}
              </span>
            </div>
            <Button
              variant="outline"
              disabled={(productsQuery.data?.length || 0) < pageSize}
              onClick={() => setPageNumber((prev) => prev + 1)}
              className="bg-white/30 backdrop-blur-md border-white/30 hover:bg-white/40"
            >
              Next
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Add Product Dialog */}
      <AddProductDialog
        setIsOpen={setIsAddProductDialogOpen}
        isOpen={isAddProductDialogOpen}
        onClose={handleAddDialogClose}
        categoryInstances={categoryInstancesQuery.data || []}
      />

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={handleEditDialogClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !editingProductId}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent className="backdrop-blur-md bg-white/20 border border-white/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.productName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={deleteProductMutation.isPending}
              className="bg-white/30 backdrop-blur-md border-white/30 hover:bg-white/40"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600/80 hover:bg-red-700/80"
            >
              {deleteProductMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsView;