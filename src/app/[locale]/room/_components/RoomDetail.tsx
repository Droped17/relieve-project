"use client"

import { Room } from "@/src/types/room"
import clsx from "clsx"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

interface IRoomDetailsProps {
    setSelectedImage: Dispatch<SetStateAction<string | null>>
    setDialog: Dispatch<SetStateAction<boolean>>
    data: {
        findRoomBy: Room[]
    }
}

const RoomDetails = ({data, setSelectedImage, setDialog}: IRoomDetailsProps) => {
    
    const handleSelectImage = (image: string) => {
        setSelectedImage(image);
        setDialog(true);
    };
    
    return (
        <div className="flex small-mobile:flex-col small-mobile:gap-6 tablet:flex-row tablet:gap-0 justify-between">
            <div className="flex-2/3">
                <div className="grid grid-cols-6 gap-4">
                    {data?.findRoomBy[0].image.map((items: string, index: number) =>
                        <div
                            key={index}
                            className={clsx(
                                index === 0 ? 'col-span-6 aspect-[2.5/1.5]' : 'col-span-2 aspect-square',
                                'relative'
                            )}
                        >
                            <Image
                                src={items}
                                alt="room"
                                fill
                                className="object-cover rounded"
                                onClick={() => handleSelectImage(items)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1/3 px-4 flex flex-col justify-between">
                <div className="flex flex-col gap-7">
                    <p className="small-mobile:text-sm tablet:text-[16px] font-light">
                        {data?.findRoomBy[0].detail[0]}
                    </p>
                    <div>
                        <p className="small-mobile:text-sm tablet:text-lg mb-2">สิ่งของอำนวยความสะดวก</p>
                        {data?.findRoomBy[0].detail.map((item: string, index: number) => index !== 0 && <li key={index} className="small-mobile:text-sm tablet:text-[16px]">{item}</li>)}
                    </div>
                </div>

                <div className="flex justify-end">
                    <p className="text-xl flex gap-2">Price/Nights: <strong className="">{data?.findRoomBy[0].price}</strong></p>

                </div>
            </div>
        </div>
    )
}

export default RoomDetails