import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const AuthGuard = ({children, requiredRole = null}) => {
    const {data: session, status} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return 

        if (!session) {
            router.push('/not-found')
            return
        }

        if (requiredRole && session.user?.role !== requiredRole) {
            router.push('/unauthorized')
        }
    },[session, status, router, requiredRole])

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return session ? children : null

}

export default AuthGuard