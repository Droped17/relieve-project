import { getServerSession } from "next-auth"

import { redirect } from "next/navigation";
import { authOptions } from "./auth-option";

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