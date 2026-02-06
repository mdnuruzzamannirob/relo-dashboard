import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice";
import { authApi } from "./apis/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
