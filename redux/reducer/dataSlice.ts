import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataSliceState {
  tradingDecisions: any[];
  dataPoint: any[] 
}

const initialState: DataSliceState = {
    tradingDecisions: [],
    dataPoint: []
};

const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,
  reducers: {
    setDataPoint: (state, action: PayloadAction<any[]>) => {
      state.dataPoint = action.payload; 
    },
    clearDataPoint: (state) => {
      state.dataPoint = []; 
    },
    setTradingDecisions: (state, action: PayloadAction<any[]>) => {
        state.tradingDecisions = action.payload; 
    },
    clearTradingDecisions: (state) => {
        state.tradingDecisions = []; 
    },
  },
});

export const { setDataPoint, clearDataPoint, setTradingDecisions, clearTradingDecisions } = dataSlice.actions;
export default dataSlice.reducer;
