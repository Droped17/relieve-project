'use client';

import { useTranslations } from "next-intl";
import HeaderText from "@/src/components/atoms/HeaderText";
import Divider from "@/src/components/atoms/Divider";
import RoomList from "@/src/components/organisms/RoomList";
import AboutUs from "@/src/components/molecules/AboutUs";
import FilterRoom from "@/src/components/molecules/FilterRoom";

const HomePage = () => {
  const t = useTranslations()

  return (
    <div className="mx-auto max-w-[1024px] px-4 flex flex-col gap-4">
      <HeaderText title={t('home_page.relieve')} className="text-center text-3xl mt-6 font-semibold text-tertiary" />
      <div className="flex flex-col gap-6">
        {/* Filter Rooms */}
        <FilterRoom />
        {/* Rooms List */}
        <RoomList />
        {/* Divider */}
        <Divider />
        {/* Relieve Details */}
        <AboutUs />
      </div>
    </div>
  );
}

export default HomePage