import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"

interface BookingState {
    date: string,
    nights: number,
    personPerRoom: number
}

const currentDate = dayjs();

const initialState: BookingState = {
    date: currentDate.format('YYYY-MM-DD'),
    nights: 1,
    personPerRoom: 1
}

export const BookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setFormField: <K extends keyof BookingState>(
            state: BookingState,
            action: PayloadAction<{ field: K; value: BookingState[K] }>
        ) => {
            state[action.payload.field] = action.payload.value;
        },
        setFormData: (state, action: PayloadAction<Partial<BookingState>>) => {
            Object.assign(state, action.payload);
        },
        resetForm: () => initialState
    }
})

export const { setFormField, setFormData, resetForm } = BookingSlice.actions

export default BookingSlice.reducer