import { getSession } from "../lib/auth"

// MARK: Create Context For Graphql 
export const createContext = async ({ req, res }) => {
    const session = await getSession()

    return {
        user: session?.user || null
    }
}