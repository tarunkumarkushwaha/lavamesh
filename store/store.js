import { configureStore } from "@reduxjs/toolkit";
import lavaReducer from "./lavaSlice";
import { persistenceMiddleware } from './persistenceMiddleware';

const store = configureStore({
  reducer: {
    lava: lavaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export default store;