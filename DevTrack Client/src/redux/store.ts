import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import adminTaskReducer from "./slices/adminTaskSlice";
import developerReducer from "./slices/developerSlice";
import tableReducer from "./slices/tableSlice";
import taskReducer from "./slices/taskSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminTasks: adminTaskReducer,
    developer: developerReducer,
    table: tableReducer,
    tasks: taskReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
