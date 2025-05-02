import { getServerSession } from "next-auth"
import Link from "next/link";

const Header = async () => {
    const session = await getServerSession()

    console.log(session);

    return (
        <header className="flex items-center border-b border-gray-300 bg-[#ACD3A8] px-8 py-4 justify-between h-16">
            <div>
                <Link href={`/en/homepage`}>Web Name</Link>
            </div>
            <div>
                {session ? <p>{session.user?.email}</p> : <div className="flex gap-4">
                    <Link href={`/en/login`}>Login</Link>
                    <Link href={`/en/register`}>Register</Link></div>}
            </div>
        </header>
    )
}

export default Header