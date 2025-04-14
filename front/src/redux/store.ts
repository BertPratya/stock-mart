import { configureStore } from '@reduxjs/toolkit';
import tradingReducer from './tradingSlice';
import { realTimePriceReducer } from './tradingSlice';
const store = configureStore({
    reducer: {
      trading: tradingReducer,
      realTimePrice: realTimePriceReducer
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
  export default store;