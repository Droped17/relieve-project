"use client"

import { useQuery } from "@apollo/client"
import AuthGuard from "@/src/components/AuthGuard"
import { MyChart } from "@/src/components/organisms/Chart"
import { PENDING_TRANSACTION } from "@/src/app/graphql/queries/transaction.query"

const AdminPage = () => {

    const { data } = useQuery(PENDING_TRANSACTION, {
        variables: {
            status: "PENDING"
        }
    })

    return (
        <AuthGuard requiredRole="ADMIN">
            <div className="flex flex-col gap-4 max-w-[1280px]">
                <p className="text-center text-2xl font-semibold">Dashboard</p>
                <div>
                    <p>Today</p>
                    <div className="flex justify-around">
                        <div className="border border-gray-100 p-6 rounded-xl bg-blue-300">
                            <p className="font-semibold">Available room</p>
                            <p>number / number</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-primary">
                            <p className="font-semibold">Check In</p>
                            <p>number / number</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-warning">
                            <p className="font-semibold">Pending confirm</p>
                            {data?.findTransactionByStatus?.data !== null ? <p>{data?.findTransactionByStatus?.data?.length}</p> : <p>0</p>}
                        </div>
                    </div>
                </div>
                <p>Year Details</p>
                <div className="flex justify-around">
                    <p>Total Customer</p>
                    <p>Total Room</p>
                    <p>Total Income</p>
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