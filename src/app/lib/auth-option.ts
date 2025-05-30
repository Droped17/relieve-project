import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import CredentialProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcrypt'
import { AuthOptions, SessionStrategy } from 'next-auth'
import clientPromise from '@/src/app/lib/db';

export const authOptions: AuthOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: "email" },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
                name: { label: 'Name', type: "text" }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    console.warn('NextAuth: Missing email or password in credentials.');
                    throw new Error('Please enter both email and password.');
                }
                try {
                    const client = await clientPromise;
                    const db = client.db(process.env.DATABASE_NAME);
                    const usersCollection = db.collection("users");
   
                    const foundUser = await usersCollection.findOne({ email: credentials.email });
               
                    if (foundUser && foundUser.password && await bcrypt.compare(credentials.password, foundUser.password)) {
                        return {
                            id: foundUser._id.toString(),
                            firstName: foundUser.firstName,
                            lastName: foundUser.lastName,
                            email: foundUser.email,
                            role: foundUser.role,
                            phone: foundUser.phone,
                        };
                    } else {
                        console.warn('NextAuth: Invalid Email or Password (or password mismatch).');
                        throw new Error('Invalid Email or Password');
                    }
                } catch (error) {
                    console.error('NextAuth: Error during authorization:', error);
                    throw new Error('An error occurred during login. Please try again.');
                }
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt' as SessionStrategy
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.email = user.email
                token.phone = user.phone
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName
                session.user.email = token.email
                session.user.phone = token.phone
            }
            return session
        }
    },
    pages: {
        signIn: "/th/login",
        error: "/th/login"
    },
    secret: process.env.NEXTAUTH_SECRET
}
