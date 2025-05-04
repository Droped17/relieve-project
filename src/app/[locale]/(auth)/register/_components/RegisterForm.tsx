"use client"

import Button from "@/src/components/atoms/Button";
import Input from "@/src/components/atoms/Input";
// import { REGISTER_USER } from "@/src/app/graphql/mutations/user.mutation";
import { gql, useMutation } from "@apollo/client";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { FormEvent, useState } from "react"

const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
    ) {
      id
      email
    }
  }
`;

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

    const param = useParams()

    const [createUser] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            // Auto Login with NextAuth
            if (data) {
                signIn("credentials", {
                    redirect: true,
                    callbackUrl: `/${param.locale}/homepage`,
                    email: formData.email,
                    password: formData.password
                })
            }
        },
        onError: (error) => {
            console.log(error)
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
            await createUser({ variables: formData })

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-12 rounded-2xl shadow-lg bg-white">
            <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleOnChange} label="Firstname" />
            <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleOnChange} label="Lastname" />
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleOnChange} label="Email" />
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleOnChange} label="Password" />
            <Input id="phone" name="phone" type="text" value={formData.phone} onChange={handleOnChange} label="Phone" />
            <Button type="submit" title="Register" />
        </form>
    )
}

export default RegisterForm