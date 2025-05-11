'use client';

import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import clsx from "clsx";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Input from "@/src/components/atoms/Input";
import Dropdown from "@/src/components/atoms/Dropdown";

// [TODO]: Add Skeletom when loading

const FIND_ROOMS_BY_FLOOR = gql`
  query FindRoomBy($date: String, $nights: Int, $numberOfPeople: Int) {
    findRoomBy(date: $date, nights: $nights, numberOfPeople: $numberOfPeople) {
      _id
      number
      floor
      status
    }
  }
`;

const HomePage = () => {

  const [formData, setFormData] = useState({
    date: '',
    nights: 1,
    numberOfPeople: 1
  })

  useEffect(() => {
    const { date, nights, numberOfPeople } = formData;
    if (date.trim() !== "" && nights && numberOfPeople) {
      handleAllFieldsSelected();
    }
  }, [formData]);

  const nowLocal = new Date().toLocaleDateString();

  const { data, loading, error } = useQuery(FIND_ROOMS_BY_FLOOR, {
    variables: {
      date: nowLocal,
      nights: 1,
      numberOfPeople: 1
     },
  });

  const [fetchFloor, { data: floorData, loading: floorLoading }] = useLazyQuery(FIND_ROOMS_BY_FLOOR);
  const [fetchNewDate] = useLazyQuery(FIND_ROOMS_BY_FLOOR,{
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const rooms = floorData?.findRoomBy || data?.findRoomBy || [];

  const router = useRouter()
  const params = useParams()
  const t = useTranslations()


  if (loading || floorLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleFloorChange = (floor: number) => {
    fetchFloor({ variables: { floor } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  // This function will run when all fields are filled
  const handleAllFieldsSelected = async() => {
    await fetchNewDate({
    variables: {
      date: formData.date,
      nights: formData.nights,
      numberOfPeople: formData.numberOfPeople
     },
    })
  };

  return (
    <div className="mx-auto max-w-[1024px] px-4 flex flex-col gap-4">
      <HeaderText title={t('home_page.relieve')} className="text-center text-3xl mt-6 font-semibold text-tertiary" />
      <div className="flex flex-col gap-6">
        {/* Date Picker */}
        <div className="flex justify-center">
          <form className="">
            <div className="flex items-center gap-2" >
              <label>วันที่</label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
              <label>จำนวนคืน</label>
              <Dropdown name="nights" value={formData.nights} onChange={handleChange} className="border border-gray-200 p-2 rounded-sm" option={[1, 2, 3, 4]} />
              <label>จำนวนคน</label>
              <Dropdown name="person" value={formData.numberOfPeople} onChange={handleChange} className="border border-gray-200 p-2 rounded-sm" option={[1, 2, 3, 4]} />
            </div>

          </form>
        </div>
        {/* Room Status */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-secondary rounded-full"></div>
            <p>ว่าง</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-error rounded-full"></div>
            <p>เต็ม</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-gray-300 rounded-full"></div>
            <p>ไม่พร้อมบริการ</p>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex justify-between shadow-lg">
          <div>
            {rooms.slice(0, 7).map((item,index) => (
              <button
                key={`${item.id}+${index}`}
                disabled={item.status === 'full' || item.status === 'null_value' && true}
                onClick={() => router.push(`/${params.locale}/room/${item._id}`)}
                className={clsx(
                  'border  border-gray-200 p-4 w-28 flex justify-center',
                  {
                    'bg-gray-200 hover:bg-gray-300 transition cursor-pointer': item.status === 'NULL_VALUE',
                    'bg-red-300': item.status === 'FULL',
                    'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'EMPTY',
                  },
                )}
              >
                {item.number}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center w-full border border-gray-200 bg-warm">
            <p>FREE SPACE</p>
          </div>
          {/* RIGHT */}
          <div>
            {rooms.slice(7, 14).map((item,index) => (
              <button
                key={`${item.id}+${index}`}
                disabled={item.status === 'full' || item.status === 'null_value' && true}
                onClick={() => router.push(`/${params.locale}/room/${item.id}`)}
                className={clsx(
                  'border  border-gray-200 p-4 w-28 flex justify-center',
                  {
                    'bg-gray-200 hover:bg-gray-300 transition cursor-pointer': item.status === 'NULL_VALUE',
                    'bg-red-300': item.status === 'FULL',
                    'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'EMPTY',
                  },
                )}
              >
                {item.number}
              </button>
            ))}
          </div>

        </div>


        {/* Select Floor */}
        <div className="flex justify-between">
          {/* [TODO]: Change this time */}
          <p className="font-semibold text-lg">{nowLocal}</p>
          <div className="flex gap-2">
          <button
              onClick={() => handleFloorChange(1)}
              className={`${rooms[0]?.floor === 1 ? 'bg-tertiary text-white' : ''
                } p-2 border border-transparent hover:border-gray-400 cursor-pointer transition-all rounded-md`}
            >
              Floor 2
            </button>
            <button
              onClick={() => handleFloorChange(2)}
              className={`${rooms[0]?.floor === 2 ? 'bg-tertiary text-white' : ''
                } p-2 border border-transparent hover:border-gray-400 cursor-pointer transition-all duration-300 rounded-md`}
            >
              Floor 2
            </button>

          </div>
        </div>

        {/* Relieve Details */}
        <Divider />
        <div className="flex flex-col items-center justify-center gap-6">
          <HeaderText title="About us" className="text-2xl font-semibold" />
          <Image alt="home_img" width={600} height={600} src={`https://images.unsplash.com/photo-1742898958003-63577fe8776e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} />
        </div>
        <p className="pb-4">{t('home_page.title')}</p>
      </div>
    </div>
  );
}

export default HomePage