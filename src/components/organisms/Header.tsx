"use client"

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";

const Header = () => {

    const session = useSession()
    const params = useParams()


    return (
        <header className="flex items-center border-b border-gray-300 bg-secondary px-8 py-4 justify-between h-16">
            <div className="flex items-center">
            <Link href={`/${params.locale}/homepage`} className="flex items-center gap-2 font-mono text-lg font-bold text-tertiary">
                 <Image alt="" src="/images/onsen.png" width={60} height={45}/>
                 <p>Relieve</p>
            </Link>
            </div>

            <div className="flex gap-4 items-center">
                <div className="hover:bg-primary transition p-2 rounded-full">
                    <Link href={`/${params.locale}/transaction`}>Transaction</Link>
                </div>
                {session.data ? (
                    <>
                    <p>{session.data.user?.name}</p>
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