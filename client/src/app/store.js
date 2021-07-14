import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducers/authReducer";
import todoReducer from "../redux/reducers/todoReducer";

export const store = configureStore({
  reducer: {
    user: authReducer,
    todos: todoReducer,
  },
});
