"use client"

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {

    const [dialog, setDialog] = useState<boolean>(false)

    const session = useSession()

    const handleDialog = () => {
        setDialog(!dialog)
    }


    return (
        <header className="flex items-center border-b border-gray-300 bg-[#ACD3A8] px-8 py-4 justify-between h-16">
            <div>
                <Link href={`/en/homepage`}>Web Name</Link>
            </div>

            <div className="flex gap-2 p-2 rounded-full hover:bg-[#8AB2A6] transition cursor-pointer relative">
                {session ? <div onClick={handleDialog}>
                    {session.data?.user?.email}
                    {dialog && <div className="absolute right-0 top-12 rounded-md bg-white shadow-xl">
                        <div className="p-2 flex flex-col gap-2">
                            <Link href={`/en/transaction`} className="hover:bg-gray-200 p-1 rounded-md">Transaction</Link>
                            {session?.data?.user && <button onClick={() => signOut({ callbackUrl: "/th/homepage" })} className="p-1 hover:bg-red-300 cursor-pointer transition rounded-md">Logout</button>}
                        </div>
                    </div>}
                </div> : <div className="flex gap-4">
                    <Link href={`/en/login`}>Login</Link>
                    <Link href={`/en/register`}>Register</Link></div>}
            </div>

        </header>
    )
}

export default Header