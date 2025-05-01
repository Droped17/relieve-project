interface HeaderTextProps {
    title: string
    className?: string
}

const HeaderText = ({title,className}: HeaderTextProps) => {
    return (
        <p className={`${className}`}>
            {title}
        </p>
    )
}

export default HeaderText