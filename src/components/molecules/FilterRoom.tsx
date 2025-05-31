// import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { setFormField } from "@/src/store/slice/bookingSlice";
import { RootState } from "@/src/store/store";
import { AppDispatch } from "@/src/store/store";
import DatePicker from "./DatePicker";
import Dropdown from "./Dropdown";

const nightOptions = [1, 2, 3, 4];
const personOptions = [1, 2, 3, 4];

const FilterRoom = () => {
  const formData = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch<AppDispatch>();
  // const t = useTranslations();

  const handleChange = (name: string, value: number | string) => {
    dispatch(setFormField({ field: name as keyof typeof formData, value }));
  };

  return (
    <div className="flex gap-4 small-mobile:flex-col tablet:flex-row justify-center items-center p-4 rounded-2xl">
      <label className="text-tertiary">{'วันที่'}</label>
      <DatePicker />

      <label className="text-tertiary">{'จำนวนคืน'}</label>
      <Dropdown
        name="nights"
        value={formData.nights}
        onChange={handleChange}
        option={nightOptions}
      />

      <label className="text-tertiary">{'จำนวนผู้เข้าพัก'}</label>
      <Dropdown
        name="personPerRoom"
        value={formData.personPerRoom}
        onChange={handleChange}
        option={personOptions}
      />
    </div>
  );
};

export default FilterRoom;
