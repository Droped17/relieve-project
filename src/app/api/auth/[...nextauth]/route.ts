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
                password: { label: 'Password', type: 'password', placeholder: 'password' }
            },
            async authorize(credentials) {
                const db = client.db()
                if (!credentials) return null
                const foundUser = await db.collection("users").findOne({
                    email: credentials.email
                })
                
                if (foundUser && (await bcrypt.compare(credentials.password, foundUser.password))) {
                    console.log('FOUND');
                    return {
                        id: foundUser.id,
                        name: foundUser.name,
                        email: foundUser.email,
                        role: foundUser.role
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
            }
            console.log(token);
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            console.log(session);
            return session
        }
    },
    pages: {
        signIn: "/th/login"
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}