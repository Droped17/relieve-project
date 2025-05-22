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

    const numericFields = ['nights', 'personPerRoom'];
    const parsedValue = numericFields.includes(name)
      ? Number(value)
      : value;

    dispatch(setFormField({ field: name as any, value: parsedValue }));
  };

    return (
        <div className="flex gap-4 small-mobile:flex-col tablet:flex-row justify-center items-center border border-gray-100 shadow-lg bg-dark-brown p-4 rounded-2xl">
            <p className="text-warm">วันที่</p>
            <DatePicker />
            <p className="text-warm">จำนวนคืน</p>
            <Dropdown name="nights" value={formData.nights} onChange={handleChange} className="border border-gray-200 p-2 rounded-md text-warm" option={[1, 2, 3, 4]} />
            <p className="text-warm">จำนวนผู้เข้าพัก</p>
            <Dropdown name="personPerRoom" value={formData.personPerRoom} onChange={handleChange} className="border border-gray-200 p-2 rounded-md text-warm" option={[1, 2, 3, 4]} />
        </div>
    )
}

export default FilterRoom