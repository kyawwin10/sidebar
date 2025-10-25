import { useForm } from "react-hook-form";
import api from "@/api";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

interface AddDoctorForm {
  name: string;
  description: string;
  storePosition: string;
  storeName: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
}

const AddDoctorDialog = ({ onClose }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddDoctorForm>();
  const addDoctor = api.booking.bookingApi.useAddDoctor();

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dummy upload handler, replace with your actual upload logic
  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setValue("profileImageUrl", url);
      setIsLoading(false);
    }, 1000);
  };

  const onSubmit = (data: AddDoctorForm) => {
    addDoctor.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-white/90 p-6 rounded-2xl shadow-xl w-[500px] text-gray-900">
        <h2 className="text-xl font-bold mb-4">➕ Add Doctor</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {isLoading && (
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
                  onClick={() => {
                    setImagePreview("");
                    setValue("profileImageUrl", "");
                  }}
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">Doctor Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="Enter doctor name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <input
              {...register("description")}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="Doctor specialization"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Store Position</label>
              <input
                {...register("storePosition")}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block mb-1">Store Name</label>
              <input
                {...register("storeName", {
                  required: "Store name is required",
                })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm">
                  {errors.storeName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="+95..."
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="doctor@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addDoctor.isPending}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
            >
              {addDoctor.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorDialog;
