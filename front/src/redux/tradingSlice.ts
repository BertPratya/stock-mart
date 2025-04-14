import { createSlice } from '@reduxjs/toolkit';
import { timeStamp } from 'node:console';
import { availableMemory } from 'node:process';

const stockSlice = createSlice({
  name: 'stockSlice',
  initialState: {
    stockId: -999,
    symbol: "",
    companyName: "",
    price: 0,
    availableShares: 0
  },
  reducers: {
    setStock: (state, action) => {
      state.stockId = action.payload.stockId;
      state.symbol = action.payload.symbol;
      state.companyName = action.payload.companyName;
      state.price = action.payload.price;
      state.availableShares = action.payload.availableShares
    },
  },
});


const realTimePriceSlice = createSlice({
  name: 'realTimePriceSlice',
  initialState: {
    stockId: -999,
    low: 0,
    high: 0,
    open: 0,
    close: 0,
    timeStamp: new Date().toISOString(),
  },
  reducers: {
    setRealTimePrice: (state, action) => {
      state.stockId = action.payload.stockId; 
      state.low = action.payload.low;
      state.high = action.payload.high;
      state.open = action.payload.open;
      state.close = action.payload.close;
      state.timeStamp = action.payload.timeStamp; 
    },
  },
});

export const { setRealTimePrice } = realTimePriceSlice.actions;
export const realTimePriceReducer = realTimePriceSlice.reducer;
export const { setStock } = stockSlice.actions;
export default stockSlice.reducer;

