import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
