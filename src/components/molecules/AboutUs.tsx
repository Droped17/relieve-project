import Image from "next/image"
import HeaderText from "../atoms/HeaderText"
import { useTranslations } from "next-intl"

const AboutUs = () => {
    const t = useTranslations()
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6">
                <HeaderText title="About us" className="text-2xl font-semibold" />
                <Image alt="home_img" width={600} height={600} src={`https://images.unsplash.com/photo-1742898958003-63577fe8776e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} />
            </div>
            <p className="pb-4">{t('home_page.title')}</p>
        </>
    )
}

export default AboutUs