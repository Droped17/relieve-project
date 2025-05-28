import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface AuthGuardProps {
    children: ReactNode; // 'children' can be any React node
    requiredRole?: "ADMIN" | "USER"; 
}

const AuthGuard = ({children, requiredRole = "ADMIN"}: AuthGuardProps) => {
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