// app/graphql/context.ts
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "../lib/auth-option";


export const createContext = async ({}: { req: NextRequest }) => {
  // Get the session using NextAuth
  const session = await getServerSession(authOptions);
  
  // Return the context object with user information
  return {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    // Add user role if available in your session
    userRole: session?.user?.role || null,
    
    // Helper functions for authorization
    hasRole: (role: string) => session?.user?.role === role,
    isAdmin: () => session?.user?.role === "ADMIN",
  };
};

// Define TypeScript interface for the context (optional but recommended)
export interface GraphQLContext {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    [key: string]: unknown;
  } | null;
  isAuthenticated: boolean;
  userRole: string | null;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}