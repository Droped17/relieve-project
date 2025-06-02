"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@apollo/client"
import Dialog from "@/src/components/molecules/Dialog"
import PageTitle from "@/src/components/molecules/PageTitle"
import Loading from "../../loading"
import RoomDetails from "../_components/RoomDetail"
import { FIND_ROOMS_BY_ID } from "@/src/app/graphql/queries/room.query"

// [TODO]: Localization

const RoomPage = () => {

    const [dialog, setDialog] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const params = useParams()
    const { data, loading, error } = useQuery(FIND_ROOMS_BY_ID, {
        variables: { id: params.id }
    })

    if (loading) return <Loading />
    if (error) return <p>Error..</p>;

    console.log(data);

    return (
        <div className="small-mobile:p-3 tablet:p-8 flex flex-col small-mobile:gap-4 tablet:gap-8 max-w-[1024px] mx-auto">
            {/* Title */}
            <PageTitle callBackUrl={`/${params.locale}/homepage`} title={`Room ${data?.findRoomBy[0].number}`} />

            {/* Room Details */}
            <RoomDetails data={data} setDialog={setDialog} setSelectedImage={setSelectedImage}/>

            {/* Button */}
            <div className="flex justify-center">
                <Link href={`${params.id}/booking`} className="p-4 bg-[#8AB2A6] rounded-xl w-[200px] text-white cursor-pointer hover:bg-[#6b9e8f] hover:shadow-xl transition text-center">จอง</Link>
            </div>

            {/* Dialog */}
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