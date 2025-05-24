"use client"

import AuthGuard from "@/src/components/AuthGuard"
import { MyChart } from "@/src/components/organisms/Chart"

/* [TODO]: Fix render Admin when loading */

const AdminPage = () => {
    return (
        <AuthGuard requiredRole="ADMIN">
            <div className="flex flex-col gap-4">
                <p className="text-center text-2xl font-semibold">Dashboard</p>
                <div>
                    <p>Today</p>
                    <div className="flex justify-around">
                        <div className="border border-gray-100 p-6 rounded-xl bg-blue-300">available room</div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-primary">check in</div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-warning">pending room</div>
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