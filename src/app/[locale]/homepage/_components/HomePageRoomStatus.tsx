import RoomStatus from "@/src/components/molecules/RoomStatus"

const roomStatus = [
    { id: 1, title: "ว่าง", className: "bg-primary" },
    { id: 2, title: "เต็ม", className: "bg-error" },
    { id: 3, title: "ไม่พร้อมบริการ", className: "bg-gray" },
]

const HomePageRoomStatus = () => {
    return (
        <div className="flex gap-2">
            {roomStatus.map((item) => (
                <RoomStatus key={`${item.id}`} title={item.title} className={item.className} />
            ))}
        </div>
    )
}

export default HomePageRoomStatus