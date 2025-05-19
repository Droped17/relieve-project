"use client"

import { setFormField } from "@/src/store/slice/bookingSlice";
import { AppDispatch } from "@/src/store/store";
import { gql, useQuery } from "@apollo/client";
import { RootState } from "@reduxjs/toolkit/query";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../atoms/Input";
import Dropdown from "../atoms/Dropdown";
import { SkeletonBox } from "../atoms/SkeletonBox";
import { SkeletonText } from "../atoms/SkeletonText";

const GET_ALL_ROOMS = gql`
  query AllRooms($date: String!, $nights: Int!, $personPerRoom: Int!, $floor: Int) {
    allRooms(date: $date, nights: $nights, personPerRoom: $personPerRoom, floor: $floor) {
      _id
      floor
      number
      status
      isBooked
    }
  }
`
const currentDate = dayjs();
currentDate.format('YYYY-MM-DD')

const RoomList = () => {
    const [floor, setFloor] = useState(1);
    const formData = useSelector((state: RootState) => state.booking);
    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter()
    const params = useParams()
    const t = useTranslations()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const numericFields = ['nights', 'numberOfPeople'];
        const parsedValue = numericFields.includes(name)
            ? Number(value)
            : value; // For 'date', just store as YYYY-MM-DD

        dispatch(setFormField({ field: name as any, value: parsedValue }));
    };

    const handleFloorChange = (newFloor: number) => {
        setFloor(newFloor);
    };


    const { data, loading, error, refetch } = useQuery(GET_ALL_ROOMS, {
        variables: {
            date: formData.date,
            nights: 1,
            personPerRoom: 1,
            floor: 1
        },
    });

    // Refetch when all fields are valid and change
    useEffect(() => {
        if (
            formData.date.trim() !== '' &&
            formData.nights > 0 &&
            formData.personPerRoom > 0
        ) {
            refetch({
                date: formData.date,
                nights: formData.nights,
                personPerRoom: formData.personPerRoom,
                floor,
            });
        }
    }, [formData, floor, refetch]);

    if (loading) return <SkeletonBox height="168px" className="p-2 flex flex-col gap-4">
        <SkeletonText className="bg-gray-200"/>
        <SkeletonText className="bg-gray-200"/>
        <SkeletonText className="bg-gray-200"/>
        <SkeletonText className="bg-gray-200"/>
    </SkeletonBox>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {/* Date Picker */}
            <div className="flex justify-center">
                <form className="">
                    <div className="flex items-center gap-2" >
                        <label>วันที่</label>
                        <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
                        <label>จำนวนคืน</label>
                        <Dropdown name="nights" value={formData.nights} onChange={handleChange} className="border border-gray-200 p-2 rounded-sm" option={[1, 2, 3, 4]} />
                        <label>จำนวนคน</label>
                        <Dropdown name="person" value={formData.personPerRoom} onChange={handleChange} className="border border-gray-200 p-2 rounded-sm" option={[1, 2, 3, 4]} />
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
                    {data.allRooms.slice(0, 7).map((item, index) => (
                        <button
                            key={`${item.id}+${index}`}
                            disabled={item.isBooked === true}
                            onClick={() => router.push(`/${params.locale}/room/${item._id}`)}
                            className={clsx(
                                'border  border-gray-200 p-4 w-28 flex justify-center',
                                {
                                    'bg-gray-200 hover:bg-gray-300 transition cursor-pointer': item.status === 'NULL_VALUE',
                                    'bg-red-300': item.isBooked === true,
                                    'bg-secondary hover:bg-primary transition cursor-pointer': !item.isBooked,
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
                    {data.allRooms.slice(7, 14).map((item, index) => (
                        <button
                            key={`${item.id}+${index}`}
                            disabled={item.isBooked === true}
                            onClick={() => router.push(`/${params.locale}/room/${item._id}`)}
                            className={clsx(
                                'border  border-gray-200 p-4 w-28 flex justify-center',
                                {
                                    'bg-gray-200 hover:bg-gray-300 transition cursor-pointer': item.status === 'NULL_VALUE',
                                    'bg-red-300': item.isBooked === true,
                                    'bg-green-300 hover:bg-green-400 transition cursor-pointer': !item.isBooked,
                                },
                            )}
                        >
                            {item.number}
                        </button>
                    ))}
                </div>

            </div>


            {/* Select Floor */}
            <div className="flex justify-between items-center">
                {/* [TODO]: Change this time */}
                <p className="font-semibold text-lg">{currentDate.format('DD-MM-YYYY')}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFloorChange(1)}
                        className={`${floor === 1 ? 'bg-tertiary text-white' : ''
                            } p-2 border border-transparent hover:border-gray-400 cursor-pointer transition-all rounded-md`}
                    >
                        Floor 1
                    </button>
                    <button
                        onClick={() => handleFloorChange(2)}
                        className={`${floor === 2 ? 'bg-tertiary text-white' : ''
                            } p-2 border border-transparent hover:border-gray-400 cursor-pointer transition-all duration-300 rounded-md`}
                    >
                        Floor 2
                    </button>

                </div>
            </div>
        </div>
    )
}

export default RoomList