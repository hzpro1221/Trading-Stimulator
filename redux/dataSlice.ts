import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataSliceState {
  data: any[]; 
}

const initialState: DataSliceState = {
  data: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload; 
    },
    clearData: (state) => {
      state.data = []; 
    },
  },
});

export const { setData, clearData } = dataSlice.actions;
export default dataSlice.reducer;
