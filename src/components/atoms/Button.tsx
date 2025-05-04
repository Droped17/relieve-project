interface ButtonProps {
    title: string
    className?: string
    onClick?: () => void
    type: "button" | "submit" | "reset" | undefined
}

const Button = ({className,title,onClick,type}: ButtonProps) => {
    return (
        <button onClick={onClick} type={type} className={`${className} cursor-pointer w-full bg-primary hover:bg-secondary transition text-white py-2 rounded`}>{title}</button>
    )
}

export default Button