import { configureStore } from "@reduxjs/toolkit";
import BookingReducer from "./slice/bookingSlice"

export const store = configureStore({
    reducer: {
        booking: BookingReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;