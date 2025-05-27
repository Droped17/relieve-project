declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      image?: string | null;
      name?: string | null;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
  }

  interface User {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
}