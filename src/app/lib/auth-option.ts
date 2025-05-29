import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import CredentialProvider from 'next-auth/providers/credentials'
// import dbConnect from '@/src/lib/mongoose'
// import client from '@/src/app/lib/db'
import * as bcrypt from 'bcrypt'
import { AuthOptions, SessionStrategy } from 'next-auth'
// import client from '@/src/app/lib/db';
// import dbConnect from '@/src/lib/mongoose';
import clientPromise from '@/src/app/lib/db';
import dbConnect from '@/src/lib/mongoose';

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
                // const db = client.db()
                // const db = (await clientPromise).db()
                if (!credentials) return null
                const foundUser = await db.collection("users").findOne({ email: credentials.email })
                if (foundUser && await bcrypt.compare(credentials.password, foundUser.password)) {
                    return {
                        id: foundUser._id.toString(),
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email: foundUser.email,
                        role: foundUser.role,
                        phone: foundUser.phone
                    }
                }
                else {
                    throw new Error('Invalid Email or Password')
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
