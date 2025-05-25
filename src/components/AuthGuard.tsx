import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const AuthGuard = ({children, requiredRole = "ADMIN"}) => {
    const [allowed, setAllowed] = useState<boolean>(false);
    const {data: session, status} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return 

        if (!session) {
            router.replace('/not-found')
            return
        }

        if (requiredRole && session.user?.role !== requiredRole) {
            router.replace('/not-found')
        }
        setAllowed(true);
    },[session, status, router, requiredRole])

    if (status === "loading" || !allowed) {
        return <div>Loading...</div>
    }

    return session ? children : null

}

export default AuthGuard