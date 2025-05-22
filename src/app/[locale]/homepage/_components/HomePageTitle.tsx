import { useTranslations } from "next-intl"
import HeaderText from "@/src/components/atoms/HeaderText"

const HomePageTitle = () => {
    const t = useTranslations()
    return (
        <div className="flex small-mobile:flex-col small-mobile:py-0 tablet:flex-row tablet:py-14 items-center">
            <div className="flex-1/2">
                {/* Relieve Name */}
                <HeaderText title={t('home_page.relieve')} className="small-mobile:mt-0 small-mobile:py-4 small-mobile:text-3xl tablet:text-6xl  text-center font-semibold text-tertiary" />
            </div>
            <div className="flex-1/2">
                {/* Relieve Details */}
                <HeaderText title={t('home_page.title')} className="small-mobile:text-sm tablet:text-lg text-center text-lg text-tertiary" />
            </div>
        </div>
    )
}

export default HomePageTitle