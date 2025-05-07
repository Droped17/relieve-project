"use client"

import HeaderText from "@/src/components/atoms/HeaderText"
import Dialog from "@/src/components/molecules/Dialog"
import { gql, useQuery } from "@apollo/client"
import Image from "next/image"
import Link from "next/link"

import { useParams } from "next/navigation"
import { useState } from "react"

const FIND_ROOMS_BY_ID = gql`
  query FindRoomBy($id: ID) {
    findRoomBy(id: $id) {
      number
      detail
      price
      image
    }
  }
`;

const RoomPage = () => {

    const [dialog, setDialog] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const params = useParams()
    const { data, loading, error } = useQuery(FIND_ROOMS_BY_ID, {
        variables: { id: params.id }
    })

    if (loading) return <p>Loading..</p>

    const handleSelectImage = (image: string) => {
        setSelectedImage(image);
        setDialog(true);
    };


    return (
        <div className="p-6 flex flex-col gap-8 max-w-[1024px] mx-auto">
            <div className="flex">
                <Link href={`/${params.locale}/homepage`} className="cursor-pointer px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                </Link>
                <HeaderText title={`Room ${data?.findRoomBy[0].number}`} className="font-semibold text-xl" />
            </div>

            <div className="flex justify-between">
                <div className="flex-2/3">
                    <div className="grid grid-cols-6 gap-4">
                        {data?.findRoomBy[0].image.map((items, index) =>
                            <div
                                key={`${items}+${index}`}
                                className={index === 0 ? "col-span-6" : "col-span-2"}
                            >
                                    <Image
                                        alt="room-details-img"
                                        src={items}
                                        width={index === 0 ? 500 : 211}
                                        height={index === 0 ? 500 : 211}
                                        className="w-full h-auto object-cover"
                                        onClick={() => handleSelectImage(items, index)}
                                    />
                   
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1/3 px-4 flex flex-col justify-between">
                    <div>
                        <p>สิ่งของอำนวยความสะดวก</p>
                        {data?.findRoomBy[0].detail.map((item, index) => index !== 0 && <li key={index}>{item}</li>)}
                    </div>

                    <div className="flex justify-end">
                        <p className="text-xl flex gap-2">Price: <strong className="">{data?.findRoomBy[0].price}</strong></p>

                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Link href={`${params.id}/booking`} className="p-4 bg-[#8AB2A6] rounded-xl w-[200px] text-white cursor-pointer hover:bg-[#6b9e8f] hover:shadow-xl transition text-center">จอง</Link>
            </div>

            {dialog && selectedImage && (
                <Dialog className="w-full" onClose={() => setDialog(false)}>
                    <Image
                        alt="selected-room-img"
                        src={selectedImage}
                        width={700}
                        height={700}
                        className="w-full h-auto object-cover rounded-md"
                    />
                </Dialog>
            )}

        </div>

    )
}

export default RoomPage