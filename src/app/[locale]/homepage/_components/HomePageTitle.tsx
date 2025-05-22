import { useTranslations } from "next-intl"
import HeaderText from "@/src/components/atoms/HeaderText"

const HomePageTitle = () => {
    const t = useTranslations()
    return (
        <div className="flex items-center min-h-[250px]">
            <div className="flex-1/2">
                {/* Relieve Name */}
                <HeaderText title={t('home_page.relieve')} className="text-center text-4xl mt-6 font-semibold text-tertiary" />
            </div>
            <div className="flex-1/2">
                {/* Relieve Details */}
                <HeaderText title={t('home_page.title')} className="text-center text-lg mt-6 text-tertiary" />
            </div>
        </div>
    )
}

export default HomePageTitle