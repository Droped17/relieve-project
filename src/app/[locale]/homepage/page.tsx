'use client';

import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import clsx from "clsx";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

// [TODO]: Add Skeletom when loading

const FIND_ROOMS_BY_FLOOR = gql`
  query FindRoomBy($floor: Int!) {
    findRoomBy(floor: $floor) {
      id
      number
      floor
      status
    }
  }
`;

const HomePage = () => {

  const { data, loading, error } = useQuery(FIND_ROOMS_BY_FLOOR, {
    variables: { floor: 1 },
  });
  const [fetchFloor, { data: floorData, loading: floorLoading }] = useLazyQuery(FIND_ROOMS_BY_FLOOR);

  const rooms = floorData?.findRoomBy || data?.findRoomBy || [];

  const router = useRouter()
  const params = useParams()
  const t = useTranslations()

  const nowLocal = new Date().toLocaleDateString();

  if (loading || floorLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleFloorChange = (floor: number) => {
    fetchFloor({ variables: { floor } });
  };

  return (
    <div className="mx-auto max-w-[1024px] px-4 flex flex-col gap-4">
      <HeaderText title={t('home_page.relieve')} className="text-center text-3xl mt-6 font-semibold text-tertiary" />
      <div className="flex flex-col gap-6">
        {/* Date Picker */}
        <div className="flex justify-center">
          <form>
            <label>วันที่</label>
            <input type="date" name="" id="" className="border" />
            <label>จำนวนคืน</label>
            <select name="day" id="day" className="border">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <label>จำนวนคน</label>
            <select name="persons" id="persons" className="border">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
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
            {rooms.slice(0, 7).map((item) => (
              <button
                key={item.id}
                disabled={item.status === 'full' || item.status === 'empty' && true}
                onClick={() => router.push(`/${params.locale}/room/${item.id}`)}
                className={clsx(
                  'border  border-gray-200 p-4 w-28 flex justify-center',
                  {
                    'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                    'bg-red-300': item.status === 'full',
                    'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null_value',
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
            {rooms.slice(7, 14).map((item) => (
              <button
                key={item.id}
                disabled={item.status === 'full' || item.status === 'empty' && true}
                onClick={() => router.push(`/${params.locale}/room/${item.id}`)}
                className={clsx(
                  'border border-gray-300 p-4 w-28 flex justify-center',
                  {
                    'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                    'bg-red-300': item.status === 'full',
                    'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null_value',
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
          {/* <button onClick={handleSelectFloor} className="bg-blue-500 rounded-md p-2 text-white cursor-pointer">Floor {floor === true ? '1' : '2'}</button> */}
          <div className="flex gap-2">
            <button onClick={() => handleFloorChange(1)} className="p-2 hover:bg-primary hover:text-white cursor-pointer transition rounded-md ">Floor 1</button>
            <button onClick={() => handleFloorChange(2)} className="p-2 hover:bg-primary hover:text-white cursor-pointer transition rounded-md ">Floor 2</button>
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