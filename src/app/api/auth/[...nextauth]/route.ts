import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import dbConnect from '@/src/lib/mongoose'
import client from '@/src/app/lib/db'
import * as bcrypt from 'bcrypt'

export const authOptions = {
    // MARK: - PROVIDER
    providers: [
        /* Credential */
        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: "email" },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
                name: {label: 'Name', type: "text"}
            },
            async authorize(credentials) {
                const db = client.db()
                if (!credentials) return null
                const foundUser = await db.collection("users").findOne({
                    email: credentials.email
                })
                
                if (foundUser && (await bcrypt.compare(credentials.password, foundUser.password))) {
                    console.log(`USER NEXTAUTH =>`,foundUser);
                    return {
                        id: foundUser.id,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        email: foundUser.email,
                        role: foundUser.role,
                        phone: foundUser.phone

                    }
                } else {
                    throw new Error('Invalid Email or Password')
                }
            },
        })
        /* Google */
    ],
    // MARK: - ADAPTER
    adapter: MongoDBAdapter(dbConnect),
    // MARK: - SESSION
    session: {
        strategy: 'jwt'
    },
    // MARK: - CALLBACK
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

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}