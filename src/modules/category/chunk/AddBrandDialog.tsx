import { useState } from "react";
import { categoryApi } from "@/api/category";

const AddBrandDialog = ({ onClose }: { onClose: () => void }) => {
  const [brandName, setBrandName] = useState("");
  const addBrandMutation = categoryApi.useAddBrand();

  const handleSubmit = () => {
    addBrandMutation.mutate({ brandName });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="p-6 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4">Add Brand</h2>
        <input
          type="text"
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-lg bg-white/30 outline-none"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-500/60 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-2 bg-blue-500/70 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandDialog;
