"use client"

import HeaderText from "@/src/components/atoms/HeaderText"
import Image from "next/image"
import Link from "next/link"

import { useParams } from "next/navigation"

// [TODO]: fetch real data
const room = {
    id: "11",
    number: 11,
    price: 800,
    status: "null",
    image: 'https://images.unsplash.com/photo-1522357262022-50fd510ac901?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}


const RoomPage = () => {

    const params = useParams()

    return (
        <div className="p-6 flex flex-col gap-8 max-w-[1024px] mx-auto">
            <div className="flex gap-4">
                <Link href={`/${params.locale}/homepage`} className="cursor-pointer px-2">{`<`}</Link>
                {/* [TODO]: change this to real room number */}
                <HeaderText title={`Room ${params.id}`} className="font-semibold text-xl" />
            </div>

            <div className="flex justify-between">
                <div className="flex-2/3">
                    <Image alt="room-details-img" width={700} height={600} src={room.image} />
                </div>
                <div className="flex-1/3 px-4 flex flex-col justify-between">
                    <div>
                        <p>สิ่งของอำนวยความสะดวก</p>
                        <li>เครื่องปรับอากาศ</li>
                        <li>น้ำดื่ม</li>
                        <li>ห้องน้ำส่วนตัว</li>
                        <li>ผ้าเช็ดตัว</li>
                        <li>ผ้าเช็ดหน้า</li>
                        <li>สบู่ ยาสระผม</li>
                        <li>ไดร์เป่าผม</li>
                    </div>

                    <div className="flex justify-end">
                    <p className="text-xl flex gap-2">Price: <strong className="">{room.price}</strong></p>

                    </div>
                </div>
            </div>

            <div className="flex gap-2">
            <Image alt="room-details-img" width={211} height={600} src={room.image} />
            <Image alt="room-details-img" width={211} height={600} src={room.image} />
            <Image alt="room-details-img" width={211} height={600} src={room.image} />
            </div>

            <div className="flex justify-center">
                <Link href={`${params.id}/booking`} className="p-4 bg-[#8AB2A6] rounded-xl w-[200px] text-white cursor-pointer hover:bg-[#6b9e8f] hover:shadow-xl transition text-center">จอง</Link>
            </div>
        </div>
    )
}

export default RoomPage