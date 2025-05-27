"use client"

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import HeaderText from "../atoms/HeaderText";
import { useTranslations } from "next-intl";

const Header = () => {

    const session = useSession()
    const params = useParams()
    const t = useTranslations()

    return (
        <header className="flex sticky top-0 z-50 opacity-90 backdrop-blur-3xl items-center border-b border-gray-200 bg-fade-gray small-mobile:px-2 medium-mobile:px-8 py-4 justify-between h-16">
            <div className="flex items-center">
            <Link href={`/${params.locale}/homepage`} className="flex items-center gap-2 font-mono text-lg font-bold text-tertiary">
                Relieve
            </Link>
            </div>
            <div className="flex gap-4 items-center">
                {session.data ? (
                    <>
                    <p>{session.data.user?.email}</p>
                    <button onClick={() => signOut({ callbackUrl: "/th/homepage" })} className="py-1 px-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer transition rounded-md">Logout</button>
                    </>

                ) : (
                    <>
                        <Link href={`/${params.locale}/login`} className="hover:bg-primary transition p-2 rounded-full">Login</Link>
                        <Link href={`/${params.locale}/register`} className="hover:bg-primary transition p-2 rounded-full">Register</Link>
                    </>
                )}
            </div>


        </header>
    )
}

export default Header