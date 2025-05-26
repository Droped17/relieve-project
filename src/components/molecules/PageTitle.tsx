import Link from "next/link"
import HeaderText from "@/src/components/atoms/HeaderText"

interface IPageTitleProps {
    title: string
    callBackUrl: string
}

const PageTitle = ({ title, callBackUrl }: IPageTitleProps) => {
    return (
      <div className="flex">
        <Link href={callBackUrl} className="cursor-pointer px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="31px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </Link>
        <HeaderText title={`${title}`} className="font-semibold small-mobile:text-lg tablet:text-2xl" />
      </div>
    );
  };
  

export default PageTitle