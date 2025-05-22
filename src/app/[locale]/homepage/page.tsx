'use client';

import { useTranslations } from "next-intl";
import { EmblaOptionsType } from 'embla-carousel'
import Image from "next/image";
import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import FilterRoom from "@/src/components/molecules/FilterRoom";
import RoomCard from "@/src/components/organisms/RoomCard";
import EmblaCarousel from "@/src/components/molecules/EmblaCarousel";
import '../../style/embla.css'
import Link from "next/link";
import clsx from "clsx";
import { useParams, usePathname } from "next/navigation";

const HomePage = () => {
  const t = useTranslations()

  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDES =  [
  "https://images.unsplash.com/photo-1619110457577-316b0a7457e5?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1580870858053-8d0764624f4f?q=80&w=1568&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1565735852636-cbf956b1d01a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

const pathname = usePathname()
const param = useParams()

const tabs = [
  { name: 'Home', path: `/${param.locale}/homepage` },
  { name: 'Transaction', path: `/${param.locale}/transaction` },
]

  return (
    <>
      <div className="mx-auto mb-10 max-w-[1280px] px-8 flex flex-col gap-4">
        <div className="flex gap-2 justify-center py-4">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={clsx(
            'pb-2 px-4',
            pathname === tab.path ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          )}
        >
          {tab.name}
        </Link>
      ))}
        </div>
        <div className="flex items-center min-h-[250px]">
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
          <div className="relative group">
            <div className="z-50 absolute inset-0">
              <p className="absolute right-5 top-5 text-warm  font-semi-bold text-xl">SPECIAL ROOM</p>
              <p className="absolute right-5 top-12 text-warm text-sm">Room No.17</p>
              <p className="absolute left-10 top-2 text-warm small-mobile:text-[20px] medium-mobile:text-[50px] 
              tablet:text-[100px] 
              laptop:text-[150px] 
              desktop:text-[200px] 
              transition-all duration-500 
              group-hover:drop-shadow-[20px_30px_0px_#310c0c]">
                RE
              </p>
              <p className="absolute right-5 bottom-1 text-warning small-mobile:text-[20px] medium-mobile:text-[50px] tablet:text-[100px] laptop:text-[150px] desktop:text-[200px] transition-all duration-500 group-hover:drop-shadow-[20px_30px_0px_#000000]">LIEVE</p>
            </div>
            <Image
              alt="relieve"
              src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={1500}
              height={500}
              className="rounded-4xl"
            />
          </div>



          <EmblaCarousel slides={SLIDES} options={OPTIONS} />

        </div>
      </div>
      {/* FOOTER */}
      <div className="bg-black text-warm py-11">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="flex-1/2 flex items-center">
            <div className="flex-1/2 flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <p className="text-4xl font-semibold text-warm">{`"`}Your space, your stay{`"`} — be<span className="text-warning">lieve</span> in re<span className="text-warning">lieve</span></p>
                <div>
                  <p className="text-xl">Contact Us</p>
                  <p>Email: relieve_test@gmail.com</p>
                  <p>Tel: 00000000000</p>
                </div>
              </div>

              <div className="flex gap-10">
                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300 ">
                  <div className="border-t">
                    <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                      YEAR FOUNDED
                    </p>
                  </div>
                  <p className="text-end text-7xl">2025</p>
                </div>

                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300">
                  <div className="border-t">
                    <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                      LOCATION
                    </p>
                  </div>
                  <p className="text-end text-7xl">Thailand</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default HomePage