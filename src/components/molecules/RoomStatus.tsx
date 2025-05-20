interface IRoomStatusProps {
    className: string
    title: string
}

const RoomStatus = ({className, title}: IRoomStatusProps) => {
    return (
        <>
            <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${className}`}></div>
                <p>{title}</p>
            </div>
        </>
    )
}

export default RoomStatus