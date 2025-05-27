"use client"

import { useTranslations } from "next-intl"
import Lottie from "lottie-react";
import loadingAnimation from "@/public/images/loading-animation.json";
import HeaderText from "@/src/components/atoms/HeaderText"

const HomePageTitle = () => {
    const t = useTranslations()
    return (
        <div className="flex small-mobile:flex-col small-mobile:py-0 tablet:flex-row tablet:py-5 items-center">
            <div className="flex-1/2">
                {/* Animation */}
                 <Lottie animationData={loadingAnimation} loop={true} className="small-mobile:h-[50px] medium-mobile:h-[200px] tablet:h-[400px]"/> 
            </div>
            <div className="flex-1/2">
                {/* Relieve Details */}
                <HeaderText title={t('home_page.relieve')} className="small-mobile:mt-0 small-mobile:py-4 small-mobile:text-3xl tablet:text-6xl  text-center font-semibold text-tertiary" />
                <HeaderText title={t('home_page.title')} className="small-mobile:text-sm tablet:text-lg text-center text-lg text-tertiary" />
            </div>
        </div>
    )
}

export default HomePageTitle