'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { AppDispatch } from '@/src/store/store';
import { setFormData } from '@/src/store/slice/bookingSlice';

export const DatePicker = () => {
    const [selected, setSelected] = useState<Date | undefined>();
    const [openDate, setOpenDate] = useState<boolean>(false)

    const formData = useSelector((state: RootState) => state.booking);
    const dispatch = useDispatch<AppDispatch>();

    const handleDateSelect = (date?: Date) => {
        setOpenDate(false)
        setSelected(date);
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            dispatch(setFormData({ date: formattedDate }));
        }
    };

    console.log(formData);

    return (
        <>
            <div className='relative z-60'>
                <div onClick={() => setOpenDate(!openDate)} className="border rounded-md border-gray-200 py-2 px-5">{format(formData.date, 'dd-MM-yyyy') || 'Select Date'}</div>
                {openDate && <div className='absolute bg-white p-4 rounded-3xl shadow-xl border border-gray'>
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDateSelect}
                    />
                    {selected && (
                        <p className="mt-2">
                            Selected date: <strong>{format(selected, 'dd-MM-yyyy')}</strong>
                        </p>
                    )}
                </div>}
            </div>
        </>
    );
}

export default DatePicker
