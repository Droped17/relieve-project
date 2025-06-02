"use client"

import React, { FormEvent, useState } from "react"
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { RegisterSchema } from "../registerSchema";
import Button from "@/src/components/atoms/Button";
import Input from "@/src/components/atoms/Input";
import HeaderText from "@/src/components/atoms/HeaderText";
import { CREATE_USER } from "@/src/app/graphql/mutations/user.mutation";
import Loading from "@/src/app/[locale]/loading";


interface IFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

const RegisterForm = () => {
    /* Initial State */
    const [formData, setFormData] = useState<IFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    })
    const [error, setError] = useState<Record<string, string[]>>({});

    const param = useParams()
    const schema = RegisterSchema()

    const [createUser, {loading}] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            // Auto Login with NextAuth
            if (data) {
                signIn("credentials", {
                    redirect: true,
                    callbackUrl: `/${param.locale}/homepage`,
                    email: formData.email,
                    password: formData.password,
                    name: formData.firstName
                })
            }
        },
        onError: (error) => {
            console.error(error)
        }
    });

    /* Function */
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
                await createUser({ variables: {
                    input: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone
                    }
                } })
            } else {
                console.error(validatedFormData.error.format());
                setError(validatedFormData.error.flatten().fieldErrors)
            }

        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <Loading/>

    return (
        /* [TODO: Refactor this input */
        /* [TODO: Localization */
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 rounded-2xl shadow-lg bg-white small-mobile:w-[280px] tablet:w-[450px]">
            <HeaderText title="Register" className="text-center text-2xl font-semibold" />
            <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleOnChange} label="Firstname" error={error.firstName}/>
            <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleOnChange} label="Lastname" error={error.lastName}/>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleOnChange} label="Email" error={error.email}/>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleOnChange} label="Password" error={error.password}/>
            <Input id="phone" name="phone" type="text" value={formData.phone} onChange={handleOnChange} label="Phone" error={error.phone}/>
            <Button type="submit" title="Register"className="bg-primary hover:bg-secondary mt-5" />
        </form>
    )
}

export default RegisterForm