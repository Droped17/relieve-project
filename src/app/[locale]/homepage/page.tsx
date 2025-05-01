'use client';

import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

/* [TODO]: fetch real data */
const room = [
  {
    id: "1",
    number: 1,
    status: "empty"
  },
  {
    id: "2",
    number: 2,
    status: "full"
  },
  {
    id: "3",
    number: 3,
    status: "null"
  },
  {
    id: "4",
    number: 4,
    status: "empty"
  },
  {
    id: "5",
    number: 5,
    status: "empty"
  },
  {
    id: "6",
    number: 6,
    status: "full"
  },
  {
    id: "7",
    number: 7,
    status: "null"
  },
  {
    id: "8",
    number: 8,
    status: "empty"
  },
  {
    id: "9",
    number: 9,
    status: "empty"
  },
  {
    id: "10",
    number: 10,
    status: "full"
  },
  {
    id: "11",
    number: 11,
    status: "null"
  },
  {
    id: "12",
    number: 12,
    status: "empty"
  },
  {
    id: "13",
    number: 13,
    status: "empty"
  },
  {
    id: "14",
    number: 14,
    status: "empty"
  },
]

const floor2 = [
  {
    id: "15",
    number: 15,
    status: "empty"
  },
  {
    id: "16",
    number: 16,
    status: "full"
  },
  {
    id: "17",
    number: 17,
    status: "null"
  },
  {
    id: "18",
    number: 18,
    status: "empty"
  },
  {
    id: "19",
    number: 19,
    status: "empty"
  },
  {
    id: "20",
    number: 20,
    status: "full"
  },
]

const HomePage = () => {

  const [floor, setFloor] = useState<boolean>(true)

  const { data } = useSession()

  const nowLocal = new Date().toLocaleDateString();

  const handleSelectFloor = () => {
    try {
      setFloor(!floor)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mx-8">
      <HeaderText title="Relieve" className="text-center text-3xl mt-6 font-semibold" />
      <div className="flex flex-col gap-6">
        <div>
          {data?.user && <button onClick={() => signOut({ callbackUrl: "/th/homepage" })} className="p-2 bg-red-400 cursor-pointer">logout</button>}
        </div>
        {/* Date Picker */}

        {/* Room Status */}

        {/* FLOOR 1 */}
          {floor && <div className="flex justify-between">
            <div>
              {room.slice(0, 7).map((item) => (
                <button
                  key={item.id}
                  disabled={item.status === 'full' || item.status === 'empty' && true}
                  className={clsx(
                    'border border-gray-300 p-4 w-28 flex justify-center',
                    {
                      'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                      'bg-red-300': item.status === 'full',
                      'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null',
                    },
                  )}
                >
                  {item.number}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center w-full border border-gray-200">
              <p>FREE SPACE</p>
            </div>
            {/* RIGHT */}
            <div>
              {room.slice(7, 14).map((item) => (
                <button
                  key={item.id}
                  disabled={item.status === 'full' || item.status === 'empty' && true}
                  className={clsx(
                    'border border-gray-300 p-4 w-28 flex justify-center',
                    {
                      'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                      'bg-red-300': item.status === 'full',
                      'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null',
                    },
                  )}
                >
                  {item.number}
                </button>
              ))}
            </div>
          </div>}
      
        {/* FLOOR 2 */}
          {!floor &&           <div className="flex justify-between">
          <div>
            {floor2.slice(0,7).map((item) => (
              <button
              key={item.id}
              disabled={item.status === 'full' || item.status === 'empty' && true}
              className={clsx(
                'border border-gray-300 p-4 w-28 flex justify-center',
                {
                  'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                  'bg-red-300': item.status === 'full',
                  'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null',
                },
              )}
            >
              {item.number}
            </button>
            ))}
          </div>
          <div className="flex items-center justify-center w-full border border-gray-200">
            <p>FREE SPACE</p>
          </div>
          {/* RIGHT */}
          <div>
            {floor2.slice(7,14).map((item) => (
              <button
              key={item.id}
              disabled={item.status === 'full' || item.status === 'empty' && true}
              className={clsx(
                'border border-gray-300 p-4 w-28 flex justify-center',
                {
                  'bg-gray-200 hover:bg-gray-300 transition': item.status === 'empty',
                  'bg-red-300': item.status === 'full',
                  'bg-green-300 hover:bg-green-400 transition cursor-pointer': item.status === 'null',
                },
              )}
            >
              {item.number}
            </button>
            ))}
          </div>

          </div>}
  
        <div className="flex justify-between">
          {/* [TODO]: Change this time */}
          <p className="font-semibold text-lg">{nowLocal}</p>
          <button onClick={handleSelectFloor} className="bg-blue-500 rounded-md p-2 text-white cursor-pointer">Floor {floor === true ? '1' : '2'}</button>
        </div>

        {/* Divider */}
        <Divider />
        {/* Relieve Details */}
        <div className="flex justify-center">
          <Image alt="home_img" width={600} height={600} src={`https://images.unsplash.com/photo-1742898958003-63577fe8776e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} />

        </div>
        <p className="pb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere voluptate accusantium facilis iste voluptatum praesentium inventore sit, enim ab, est harum soluta nobis id dolores. Ipsum quisquam ab, deleniti minus, vero numquam distinctio recusandae nisi, reprehenderit repudiandae nobis molestiae sequi! Odio numquam dignissimos repellat asperiores. Asperiores vitae, mollitia vero consectetur obcaecati animi repellendus ut vel laborum nulla cumque inventore similique quae, dolor quibusdam eligendi, veritatis rem at error perferendis. A nisi quisquam consectetur placeat odit eveniet, tempora, sit nemo impedit enim quibusdam? Doloremque suscipit repellendus rem est. Vero officia non nisi laboriosam sapiente aut corrupti odio suscipit, expedita hic quaerat?</p>
      </div>
    </div>
  );
}

export default HomePage