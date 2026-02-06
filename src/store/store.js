import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice";
import { authApi } from "./apis/authApi";
import { cmsApi } from "./apis/cmsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, cmsApi.middleware),
});
