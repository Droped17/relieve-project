/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx"
import { ChangeEvent } from "react"

interface InputProps {
    id: string
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox'
    name: string
    value?: any
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    className?: string
    label?: string
    error?: string | string[] | undefined
    readOnly?: boolean
}

const Input = ({ id, type, name, value, onChange, className, label, error, readOnly }: InputProps) => {
    return (
        <div className={clsx('flex flex-col gap-2', className)}>
            {label && <label className="font-semibold">{label}</label>}
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                className={clsx(
                    `border border-gray-200 outline-none transition px-3 py-2 rounded`,
                    readOnly ? 'focus:outline-none pointer-events-none bg-gray-100 text-gray-500' : 'focus:border-green-800',
                    className,
                    {
                        'border-red-500': error,
                    }
                )}
            />
            {error && <p className="text-error text-sm">{error}</p>}
        </div>
    )
}

export default Input