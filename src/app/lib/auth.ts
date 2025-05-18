import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";

export const getSession = async() => {
    return await getServerSession(authOptions);
}

export const getCurrentUser = async() => {
    const session = await getSession()
    return session?.user
}

export const requireAuth = async() => {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/not-found")
    }
    return user
}