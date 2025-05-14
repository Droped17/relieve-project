import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"

interface BookingState {
    date: string,
    nights: number,
    numberOfPeople: number
}

const currentDate = dayjs();

const initialState: BookingState = {
    date: currentDate.format('YYYY-MM-DD'),
    nights: 1,
    numberOfPeople: 1
}

export const BookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setFormField: (state, action: PayloadAction<{ field: keyof FormState; value: any }>) => {
            state[action.payload.field] = action.payload.value;
        },
        setFormData: (state, action: PayloadAction<BookingState>) => {
            return action.payload;
        },
        resetForm: () => initialState
    }
})

export const { setFormField, setFormData, resetForm } = BookingSlice.actions

export default BookingSlice.reducer