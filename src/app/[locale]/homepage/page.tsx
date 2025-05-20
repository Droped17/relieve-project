'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import FilterRoom from "@/src/components/molecules/FilterRoom";
import RoomCard from "@/src/components/organisms/RoomCard";

const HomePage = () => {
  const t = useTranslations()

  return (
    <>
      <div className="mx-auto mb-10 max-w-[1024px] px-4 flex flex-col gap-4">
        <div className="flex items-center min-h-[300px]">
          <div className="flex-1/2">
            <HeaderText title={t('home_page.relieve')} className="text-center text-4xl mt-6 font-semibold text-tertiary" />
          </div>
          <div className="flex-1/2">
            {/* Relieve Details */}
            <HeaderText title={t('home_page.title')} className="text-center text-lg mt-6 text-tertiary" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {/* Filter Rooms */}
          <FilterRoom />
          {/* Rooms List */}
          <RoomCard />
          {/* Divider */}
          <Divider />
          {/* Image */}
          <div className="relative">
            <div>
              <p className="absolute right-5 top-5 text-warm text-xl font-semibold">SPECIAL ROOM</p>
              <p className="absolute right-5 top-12 text-warm text-sm">Room No.17</p>
            </div>
            <Image alt="relieve" src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={1000} height={500} className="rounded-4xl" />
          </div>


          <div className="flex justify-between">
            <div className="flex gap-3">
              <Image alt="relieve" src="https://images.unsplash.com/photo-1551105378-78e609e1d468?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={350} height={500} className="rounded-4xl" />
              <div className="flex flex-col text-xl">
                <p className="font-semibold">R</p>
                <p className="font-semibold">E</p>
                <p className="font-semibold">L</p>
                <p className="font-semibold">I</p>
                <p className="font-semibold">E</p>
                <p className="font-semibold">V</p>
                <p className="font-semibold">E</p>
              </div>
            </div>
            <div className="flex flex-row items-stretch space-x-4">
              <div className="w-0.5 bg-brown"></div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col justify-end text-lg">
                <p>R</p>
                <p>e</p>
                <p>l</p>
                <p>a</p>
                <p>x</p>
              </div>
              <Image alt="relieve" src="https://images.unsplash.com/photo-1631819313347-a5dca24a04fa?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8" width={350} height={500} className="rounded-4xl shadow-xl" />
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <div>
              <Image alt="relieve" src="https://images.unsplash.com/photo-1504624720567-64a41aa25d70?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQxfHx8ZW58MHx8fHx8" width={300} height={500} className="rounded-4xl shadow-xl" />
            </div>
            <div>
              <Image alt="relieve" src="https://plus.unsplash.com/premium_photo-1674940577945-75149e41aa7b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8" width={300} height={500} className="rounded-4xl shadow-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-tertiary text-warm py-6">
        <div className="mx-auto max-w-[1024px]">
          <div className="flex-1/2 flex items-center">
            <div className="flex-1/2 flex flex-col gap-4">
              <div>
                <p className="text-3xl">Contact Us</p>
                <p>Tel: 0332222266</p>
                <p>Email: relieve-test@gmail.com</p>

              </div>
              <Divider />
              <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga, dolores doloribus. Voluptatum eligendi nobis officia voluptates aperiam unde, corrupti, dolorum magnam doloremque est itaque voluptatibus? Soluta repellat repudiandae dolorum architecto?</p>
            </div>
            <Image alt="relieve" src="https://images.unsplash.com/photo-1606011082438-5e55fea65538?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={200} height={400} className="rounded-r-3xl" />
          </div>

        </div>
      </div>
    </>
  );
}

export default HomePage