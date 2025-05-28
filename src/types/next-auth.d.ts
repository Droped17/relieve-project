// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string;
      // Add the default properties too, if you want them to be explicitly typed
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user']; // Optionally, merge with DefaultSession's user properties
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the object returned by the `authorize` callback for `CredentialsProvider`.
   */
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    // Add the default properties too, if you want them to be explicitly typed
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * The shape of the JWT when it's read by `getToken` or `jwt` callback.
   */
  interface JWT {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    // Add the default properties too, if you want them to be explicitly typed
    name?: string | null;
    email?: string | null;
    picture?: string | null; // JWT uses 'picture' instead of 'image'
  }
}