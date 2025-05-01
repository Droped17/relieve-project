interface HeaderTextProps {
    title: string
    className?: string
}

const HeaderText = ({title,className}: HeaderTextProps) => {
    return (
        <h1 className={`font-bold text-2xl ${className}`}>
            {title}
        </h1>
    )
}

export default HeaderText