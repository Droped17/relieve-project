import { requireAuth } from "@/src/app/lib/auth"

const Protect = async() => {
    const user = await requireAuth()
    return (
        <div>
            <p>Protected</p>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p>{user?.image}</p>
        </div>
    )
}

export default Protect