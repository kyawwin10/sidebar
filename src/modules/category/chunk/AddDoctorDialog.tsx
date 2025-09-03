import { useForm } from "react-hook-form";
import api from "@/api";

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
}

const AddDoctorDialog = ({ onClose }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddDoctorForm>();
  const addDoctor = api.booking.bookingApi.useAddDoctor();

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
          <div>
            <label className="block mb-1">Doctor Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="Enter doctor name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
                {...register("storeName", { required: "Store name is required" })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
              {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              {...register("phoneNumber", { required: "Phone number is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="+95..."
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="doctor@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
