'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/src/store/store';
import { setFormData } from '@/src/store/slice/bookingSlice';

export const DatePicker = () => {
    const [selected, setSelected] = useState<Date | undefined>();
    const [openDate, setOpenDate] = useState<boolean>(false)

      const dropdownRef = useRef<HTMLDivElement>(null);
    
      const formData = useSelector((state: RootState) => state.booking);
      const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpenDate(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);


    const handleDateSelect = (date?: Date) => {
        setOpenDate(false)
        setSelected(date);
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            dispatch(setFormData({ date: formattedDate }));
        }
    };

    return (
        <>
            <div className='relative z-10' ref={dropdownRef}>
                <div onClick={() => setOpenDate(!openDate)} className="cursor-pointer rounded-md border border-gray-100 shadow-md py-2 px-5 hover:bg-gray-100 transition duration-300">{format(formData.date, 'dd-MM-yyyy') || 'Select Date'}</div>
                {openDate && <div className='small-mobile:flex small-mobile:p-2 tablet:absolute mt-2 bg-white p-4 rounded-3xl shadow-xl border border-gray-200'>
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDateSelect}
                    />
                </div>}
            </div>
        </>
    );
}

export default DatePicker
