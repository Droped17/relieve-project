"use client"

import { gql, useQuery } from "@apollo/client";
import { RootState } from "@reduxjs/toolkit/query";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SkeletonBox } from "../atoms/SkeletonBox";
import { SkeletonText } from "../atoms/SkeletonText";
import RoomStatus from "../molecules/RoomStatus";
import "react-day-picker/style.css";

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


const roomStatus = [
    { id: 1, title: "ว่าง", className: "bg-primary" },
    { id: 2, title: "เต็ม", className: "bg-error" },
    { id: 3, title: "ไม่พร้อมบริการ", className: "bg-gray" },
]

const RoomCard = () => {
    const [floor, setFloor] = useState(1);
    const formData = useSelector((state: RootState) => state.booking);

    const router = useRouter()
    const params = useParams()
    const t = useTranslations()

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

    const handleFloorChange = (newFloor: number) => {
        setFloor(newFloor);
    };

    if (loading) return <SkeletonBox height="168px" className="p-2 flex flex-col gap-4">
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
    </SkeletonBox>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        <>
            {/* Room Status */}
            <div className="flex gap-2">
                {roomStatus.map((item) => (
                    <RoomStatus key={`${item.id}`} title={item.title} className={item.className} />
                ))}
            </div>

            {/* Rooms */}
            <div className="flex justify-between shadow-lg">
                <div>
                    {data.allRooms.slice(0, 5).map((item, index) => (
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
                    <p>No Event</p>
                </div>
                {/* RIGHT */}
                <div className="bg-fade-gray">
                    {data.allRooms.slice(5, 10).map((item, index) => (
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
        </>
    )
}

export default RoomCard