import { useForm } from "react-hook-form";
import api from "@/api";
interface Props {
  onClose: () => void;
}

interface AddSupplierForm {
  name: string;
}

const AddSupplierDialog = ({ onClose }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddSupplierForm>();
  const addSupplier = api.supplier.supplierApi.useAddSupplier();

  const onSubmit = (data: AddSupplierForm) => {
    addSupplier.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-white/90 p-6 rounded-2xl shadow-xl w-96 text-gray-900">
        <h2 className="text-xl font-bold mb-4">➕ Add Supplier</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Supplier Name</label>
            <input
              {...register("name", { required: "Supplier name is required" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
              placeholder="Enter supplier name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
              disabled={addSupplier.isPending}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
            >
              {addSupplier.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierDialog;
