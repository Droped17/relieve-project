"use client"

import Button from "@/src/components/atoms/Button"
import Divider from "@/src/components/atoms/Divider"
import Input from "@/src/components/atoms/Input"
import { signIn } from "next-auth/react"
import { useParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { LoginSchema } from "../loginSchema"

interface IFormData {
    email: string
    password: string    
}

const LoginForm = () => {
    const [formData,setFormData] = useState<IFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<Record<string, string[]>>({});

    const param = useParams()
    const schema = LoginSchema()


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const validatedFormData = schema.safeParse(formData)
            if (validatedFormData.success) {
                console.log('SUCCESS');
                await signIn('credentials', {
                    redirect: true,
                    callbackUrl: `/${param.locale}/homepage`,
                    email: formData.email,
                    password: formData.password,
                })
            } 
            else {
                console.log(validatedFormData.error.format());
                setError(validatedFormData.error.flatten().fieldErrors)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    console.log(error.email);
    
    return (
        <form
        onSubmit={handleSubmit}
        className="p-12 rounded-2xl shadow-lg bg-white"
    >
        <div className="flex flex-col gap-4">
        <Input id="email" type="email" name="email" value={formData.email} onChange={handleOnChange} label="Email Address" error={error.email}/>
        <Input id="password" type="password" name="password" value={formData.password} onChange={handleOnChange} label="Password" error={error.password}/>
        <Button title="Sign In" type="submit"/>
        <Divider />
        <button
            type="button"
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                width="20"
                height="20"
            >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Sign in with Google
        </button>
        </div>
    </form>
    )
}

export default LoginForm