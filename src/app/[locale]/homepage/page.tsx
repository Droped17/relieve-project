'use client';

import { signOut, useSession } from "next-auth/react";
import { Link } from "../../i18n/routing";


const HomePage = () => {
  const {data, status} = useSession()
  console.log(data)
  console.log(status)

  return (
    <div>
      <h1>HomePage</h1>
      {data?.user ? <div>
        <p>{data?.user?.email}</p>
        <p>{data?.user?.name}</p>
        <button onClick={() => signOut({callbackUrl: "/th/homepage"})} className="p-2 bg-red-400">logout</button>
      </div> : 
      <div>
        <p>Not Login</p>
        <div className="flex flex-col">
        <Link href={`/login`}>Login</Link>
        <Link href={`/register`}>Register</Link>
        </div>
      </div>}
    </div>
  );
}

export default HomePage