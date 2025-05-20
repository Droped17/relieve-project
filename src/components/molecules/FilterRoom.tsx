import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState } from "@reduxjs/toolkit/query";
import { AppDispatch } from "@/src/store/store";
import { setFormField } from "@/src/store/slice/bookingSlice";
import DatePicker from "./DatePicker"
import Dropdown from "../atoms/Dropdown"

const FilterRoom = () => {
  /* [TODO]: Localization */
  const formData = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch<AppDispatch>();

  const t = useTranslations()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const numericFields = ['nights', 'numberOfPeople'];
    const parsedValue = numericFields.includes(name)
      ? Number(value)
      : value;

    dispatch(setFormField({ field: name as any, value: parsedValue }));
  };

    return (
        <div className="flex gap-4 justify-center items-center">
            <p>วันที่</p>
            <DatePicker />
            <p>จำนวนคืน</p>
            <Dropdown name="nights" value={formData.nights} onChange={handleChange} className="border border-gray-200 p-2 rounded-md" option={[1, 2, 3, 4]} />
            <p>จำนวนผู้เข้าพัก</p>
            <Dropdown name="person" value={formData.personPerRoom} onChange={handleChange} className="border border-gray-200 p-2 rounded-md" option={[1, 2, 3, 4]} />
        </div>
    )
}

export default FilterRoom