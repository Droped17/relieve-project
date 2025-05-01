'use client';

import { signOut, useSession } from "next-auth/react";
import HeaderText from "@/src/components/atoms/HeaderText";


const HomePage = () => {
  const { data, status } = useSession()
  console.log(data)
  console.log(status)

  return (
    <div>
      <HeaderText title="HomePage" className="text-center"/>
      <div>
        <div className="flex flex-col">
          <div>
            {data?.user && <button onClick={() => signOut({ callbackUrl: "/th/homepage" })} className="p-2 bg-red-400">logout</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage