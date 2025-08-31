import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import api from "@/api";
import { AddUserDTO } from "@/api/user/type";

interface AddUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, setIsOpen }) => {
  const queryClient = useQueryClient();
  const uploadImageMutation = api.products.uploadImage.useMutation();
  const addUserMutation = api.user.userApi.useAdd();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddUserDTO>({
    defaultValues: {
      email: "",
      password: "",
      userName: "",
      age: 0,
      roleName: "",
      profileImageUrl: "",
    },
  });

  const imagePreview = watch("profileImageUrl");
  const isLoading = uploadImageMutation.isPending || addUserMutation.isPending;

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      const fullImageUrl = `https://localhost:7108/api/${result.url}`;
      setValue("profileImageUrl", fullImageUrl);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload profile image");
      console.error("Upload error:", error);
    }
  };

  const onSubmit = async (data: AddUserDTO) => {
    try {
      await addUserMutation.mutateAsync(data);
            toast.success("User added successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter password"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Label>Username</Label>
            <Input
              {...register("userName", { required: "Username is required" })}
              placeholder="Enter username"
              disabled={isLoading}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs">{errors.userName.message}</p>
            )}
          </div>
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              {...register("age", { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
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
                  onClick={() => setValue("profileImageUrl", "")}
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Admin"
                  {...register("roleName", { required: true })}
                  disabled={isLoading}
                />
                Admin
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Delivery"
                  {...register("roleName", { required: true })}
                  disabled={isLoading}
                />
                Delivery
              </label>
            </div>
            {errors.roleName && (
              <p className="text-red-500 text-xs">{errors.roleName.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
