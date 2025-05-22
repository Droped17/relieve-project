import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ITabButtonProps {
    tabs: {
    name: string;
    path: string;
}[]
}

const TabButton = ({ tabs }: ITabButtonProps) => {
    const pathname = usePathname()

    return (
        <div className="flex gap-2 justify-center pt-4">
            {tabs.map((tab) => (
                <Link
                    key={tab.path}
                    href={tab.path}
                    className={clsx(
                        'pb-2 px-4',
                        pathname === tab.path ? 'border-b-4 border-primary text-tertiary' : 'text-gray-600'
                    )}
                >
                    {tab.name}
                </Link>
            ))}
        </div>
    )
}

export default TabButton