import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  instances: string[];
}

const initialState: CategoryState = {
  instances: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addInstance: (state, action: PayloadAction<string>) => {
      state.instances.push(action.payload);
    },
    removeInstance: (state, action: PayloadAction<number>) => {
      state.instances.splice(action.payload, 1);
    },
    resetInstances: (state) => {
      state.instances = [];
    },
  },
});

export const { addInstance, removeInstance, resetInstances } = categorySlice.actions;
export default categorySlice.reducer;

