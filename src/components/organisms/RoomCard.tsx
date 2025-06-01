"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
// import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { gql, ServerError, useQuery } from "@apollo/client";
import { RootState } from "@/src/store/store";
import { Room } from "@/src/types/room";
import SkeletonBox from "../atoms/SkeletonBox";
import SkeletonText from "../atoms/SkeletonText";
import RoomButton from "../molecules/RoomButton";
import Dialog from "../molecules/Dialog";
import HomePageRoomStatus from "@/src/app/[locale]/homepage/_components/HomePageRoomStatus";
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

const RoomCard = () => {
    const [floor, setFloor] = useState(1);
    const [dialog, setDialog] = useState<boolean>(true)
    const formData = useSelector((state: RootState) => state.booking);

    const router = useRouter()
    const params = useParams()
    // const t = useTranslations()

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

    if (loading) return <SkeletonBox height="400px" className="p-2 flex flex-col gap-4">
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
        <SkeletonText className="bg-gray-200" />
    </SkeletonBox>;

    if (error) {
        const networkError = error.networkError as ServerError;
        const statusCode = networkError?.statusCode;

        if (statusCode === 429) {
            return <>
                {dialog && <Dialog className="w-full" onClose={() => setDialog(false)}>
                    Too Many Requests. Please slow down.
                </Dialog>}
            </>
        }
        return <p>{error.message}</p>;
    }

    return (
        <>
            {/* Room Status */}
            <HomePageRoomStatus />
            {/* Rooms */}
            <div className="flex justify-between shadow-[0px_1px_11px_3px_rgba(0,_0,_0,_0.1)]">
                <div className="bg-fade-gray">
                    {data.allRooms.slice(0, 5).map((item: Room, index: number) => (
                        <RoomButton
                            key={`${item._id}`}
                            number={item.number}
                            isBooked={item.isBooked}
                            status={item.status}
                            isLast={index === data.allRooms.slice(0, 5).length - 1}
                            onClick={() => router.push(`/${params.locale}/room/${item._id}`)}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-center w-full border border-gray-200 bg-warm">
                    <p>No Event</p>
                </div>
                {/* RIGHT */}
                <div className="bg-fade-gray">
                    {data.allRooms.slice(5, 10).map((item: Room, index: number) => (
                        <RoomButton
                            key={item._id}
                            number={item.number}
                            isBooked={item.isBooked}
                            status={item.status}
                            isLast={index === data.allRooms.slice(5, 10).length - 1}
                            onClick={() => router.push(`/${params.locale}/room/${item._id}`)}
                        />
                    ))}
                </div>
            </div>
            {/* Select Floor */}
            <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{currentDate.format('DD-MM-YYYY')}</p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleFloorChange(1)}
                        className={`${floor === 1 ? 'bg-tertiary text-white' : ''
                            } p-2 border border-transparent hover:border-gray-400 cursor-pointer transition-all rounded-md`}
                    >
                        Floor 1
                    </button>
                    <button
                        type="button"
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