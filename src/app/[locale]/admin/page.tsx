"use client"

import { useQuery } from "@apollo/client"
import AuthGuard from "@/src/components/AuthGuard"
import { MyChart } from "@/src/components/organisms/Chart"
import { IS_CHECKED_IN, PENDING_TRANSACTION } from "@/src/app/graphql/queries/transaction.query"
import { COUNT_EMPTY_ROOMS, YEAR_DETAIL } from "@/src/app/graphql/queries/room.query"
import dayjs from "dayjs"

const currentDate = dayjs();
currentDate.format('YYYY-MM-DD')

const AdminPage = () => {
    const { data: pendingData,loading: pendingLoading } = useQuery(PENDING_TRANSACTION, {
        variables: {
            status: "PENDING"
        }
    })

    const {data: countData, loading: countLoading, error} = useQuery(COUNT_EMPTY_ROOMS)
    const {data: isCheckedIn, loading: isCheckedInLoading, error: isCheckedInError} = useQuery(IS_CHECKED_IN, {
        variables: {
            date: currentDate.format('YYYY-MM-DD')
        }
    });
    const {data: yearDetail, loading: yearDetailLoading, error: yearDetailError} = useQuery(YEAR_DETAIL)

    if (pendingLoading || countLoading || isCheckedInLoading || yearDetailLoading) return <p>Loading..</p>
    if (error || isCheckedInError || yearDetailError) return <p>{error?.message || isCheckedInError?.message}</p>

    return (
        <AuthGuard requiredRole="ADMIN">
            <div className="flex flex-col gap-4 max-w-[1280px]">
                <p className="text-center text-2xl font-semibold">Dashboard</p>
                <div>
                    <p>Today</p>
                    <div className="flex justify-around">
                        <div className="border border-gray-100 p-6 rounded-xl bg-blue-300">
                            <p className="font-semibold">Available room</p>
                            <p className="text-white  text-xl">{countData.countEmptyRooms}</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-primary">
                            <p className="font-semibold">Check In</p>
                            <p className="text-white  text-xl">{isCheckedIn.isCheckedIn.data?.pendingCheckIn} / {isCheckedIn.isCheckedIn.data?.totalCheckIn}</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-warning">
                            <p className="font-semibold">Pending confirm</p>
                            {pendingData?.findTransactionByStatus?.data !== null ? <p className="text-white  text-xl">{pendingData?.findTransactionByStatus?.data?.length}</p> : <p>0</p>}
                        </div>
                    </div>
                </div>
                <p>Year Details</p>
                <div className="flex justify-around">
                    <p>Customers: {yearDetail.totalCustomer.data.totalUsers}</p>
                    <p>Rooms: {yearDetail.totalCustomer.data.totalRooms}</p>
                    <p>Income: {yearDetail.totalCustomer.data.totalIncome}</p>
                </div>
                <div>
                    <p>Chart for guest per month</p>
                    <MyChart />
                </div>
            </div>
        </AuthGuard>
    )
}

export default AdminPage