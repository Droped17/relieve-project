'use client';

import { useParams } from "next/navigation";
import { EmblaOptionsType } from 'embla-carousel'
import Divider from "@/src/components/atoms/Divider";
import TabButton from "@/src/components/atoms/TabButton";
import FilterRoom from "@/src/components/molecules/FilterRoom";
import EmblaCarousel from "@/src/components/molecules/EmblaCarousel";
import RoomCard from "@/src/components/organisms/RoomCard";
import Footer from "@/src/components/organisms/Footer";
import HomePageTitle from "./_components/HomePageTitle";
import HomePageImage from "./_components/HomePageImage";
import '../../style/embla.css'

const HomePage = () => {
  const params = useParams()

  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDES = [
    "https://images.unsplash.com/photo-1619110457577-316b0a7457e5?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580870858053-8d0764624f4f?q=80&w=1568&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1565735852636-cbf956b1d01a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  const tabs = [
    { name: 'Home', path: `/${params.locale}/homepage` },
    { name: 'Transaction', path: `/${params.locale}/transaction` },
  ]

  return (
    <>
      <div className="mx-auto mb-10 max-w-[1280px] small-mobile:px-2 medium-mobile:px-8 flex flex-col gap-4">
        {/* Tab Button */}
        <TabButton tabs={tabs} />
        {/* Title */}
        <HomePageTitle />
        <div className="flex flex-col gap-6">
          {/* Filter Rooms */}
          <FilterRoom />
          {/* Rooms List */}
          <RoomCard />
          {/* Divider */}
          <Divider />
          {/* Image */}
          <HomePageImage />
          {/* Carousel */}
          <EmblaCarousel slides={SLIDES} options={OPTIONS}/>
        </div>
      </div>
      {/* FOOTER */}
      <Footer/>
    </>
  );
}

export default HomePage