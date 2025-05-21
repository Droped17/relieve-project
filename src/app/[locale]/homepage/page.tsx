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

const HomePage = () => {
  const t = useTranslations()

  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())


  return (
    <>
      <div className="mx-auto mb-10 max-w-[1024px] px-4 flex flex-col gap-4">
        <div className="flex gap-2 justify-center py-4">
          <p className="border-b-2 border-primary">Home</p>
          <p>Transaction</p>
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
          <div className="relative">
            <div className="z-50">
              <p className="absolute right-5 top-5 text-warm text-xl font-semibold">SPECIAL ROOM</p>
              <p className="absolute right-5 top-12 text-warm text-sm">Room No.17</p>
              <p className="absolute top-4/12 z-30 origin-left left-1/4 transform rotate-90 text-warning text-9xl">RELIEVE</p>
            </div>
            <Image alt="relieve" src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={1500} height={500} className="rounded-4xl" />
          </div>

          <EmblaCarousel slides={SLIDES} options={OPTIONS} />

        </div>
      </div>
      {/* FOOTER */}
      <div className="bg-tertiary text-warm py-11">
        <div className="mx-auto max-w-[1024px]">
          <div className="flex-1/2 flex items-center">
            <div className="flex-1/2 flex flex-col gap-7">
              <div>
                <p className="text-4xl font-semibold">Your space, your stay — believe in relieve</p>
              </div>

              <div className="flex gap-10">

                <div className="flex flex-col rounded-full w-1/2 text-warm hover:text-black transition duration-300 group">
                  <div className="border-t">
                    <p className="border w-max py-1 p-2 group-hover:bg-warning transition">
                      YEAR FOUNDED
                    </p>
                  </div>
                  <p className="text-end text-7xl">2025</p>
                </div>

                <div className="flex flex-col rounded-full w-1/2 text-warm hover:text-black transition duration-300 group">
                  <div className="border-t">
                    <p className="border w-max py-1 p-2 group-hover:bg-warning transition">
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