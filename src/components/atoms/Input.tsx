import { ChangeEvent } from "react"

interface InputProps {
    id: string
    type: string
    name: string
    value: any
    onChange: (event: ChangeEvent<HTMLInputElement>) =>  void
    className?: string
    label?: string
    error?: string[]
}

const Input = ({id,type,name,value,onChange,className,label,error}: InputProps) => {
    return (
        <div>
        {label && <label>{label}</label>}
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`${className} ${error && 'border-red-500'} w-full border border-gray-200 focus:border-green-800 outline-none transition px-3 py-2 rounded`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}

export default Input