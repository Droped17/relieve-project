"use client"

import { useParams } from "next/navigation"

const RoomPage = () => {
    const params = useParams()

    return (
        <div>
            <p>Room {params.id}</p>
        </div>
    )
}

export default RoomPage