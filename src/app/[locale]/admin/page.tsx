"use client"

import AuthGuard from "@/src/components/AuthGuard"

const AdminPage = () => {
    return (
        <AuthGuard>
            <div>
                <p>Admin Page</p>
            </div>
        </AuthGuard>
    )
}

export default AdminPage