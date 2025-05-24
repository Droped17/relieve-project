"use client"

import AuthGuard from "@/src/components/AuthGuard"

/* [TODO]: Fix render Admin when loading */

const AdminPage = () => {
    return (
        <AuthGuard requiredRole="ADMIN">
            <div className="flex flex-col gap-4">
                <p>Dashboard</p>
                <p>Room Details</p>
                <p>Year Details</p>
                <div>
                    <p>Chart</p>
                </div>
            </div>
        </AuthGuard>
    )
}

export default AdminPage