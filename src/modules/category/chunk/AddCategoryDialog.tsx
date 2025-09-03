import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInstance, removeInstance, resetInstances } from "@/store/categorySlice"; // ✅ check path
import { RootState } from "@/store/store" // ✅ import RootState
import { categoryApi } from "@/api/category"; // ✅ import API

const AddCategoryDialog = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const { instances } = useSelector((state: RootState) => state.category);
  const [catName, setCatName] = useState("");
  const [inputValue, setInputValue] = useState("");

  const addCategoryMutation = categoryApi.useAddCategory();

  const handleSubmit = () => {
    if (!catName.trim()) return;
    addCategoryMutation.mutate({ catName, instanceNames: instances });
    dispatch(resetInstances());
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="p-6 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4">Add Category</h2>

        <input
          type="text"
          placeholder="Category Name"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-lg bg-white/30 outline-none"
        />

        {/* Instance Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Instance Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/30 outline-none"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                dispatch(addInstance(inputValue));
                setInputValue("");
              }
            }}
            className="px-3 py-2 bg-green-500/70 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Instances List */}
        <ul className="mb-3">
          {instances.map((inst: string, idx: number) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-white/10 rounded-md p-2 mb-1"
            >
              {inst}
              <button
                onClick={() => dispatch(removeInstance(idx))}
                className="text-red-400"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-500/60 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-500/70 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryDialog;
