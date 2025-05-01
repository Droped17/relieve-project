"use client"

// import { REGISTER_USER } from "@/src/app/graphql/mutations/user.mutation";
import { gql, useMutation } from "@apollo/client";
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

    /* Handle Loading, Error */
    // if (loading) return <LoadingTable />
    // if (isError(error)) return <Error />


    const [createUser] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            console.log(data)
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

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault()
        try {
            console.log(formData)
            // await dbConnect();
            await createUser({variables: formData})
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label>Firstname</label>
            <input type="text"
                className="border p-2 border-gray-200 rounded-sm"
                value={formData.firstName}
                id="firstName"
                name="firstName"
                onChange={handleOnChange} />
            <label>Lastname</label>
            <input type="text"
                className="border p-2 border-gray-200 rounded-sm"
                value={formData.lastName}
                id="lastName"
                name="lastName"
                onChange={handleOnChange} />

            <label>Email</label>
            <input type="text"
                className="border p-2 border-gray-200 rounded-sm"
                value={formData.email}
                id="email"
                name="email"
                onChange={handleOnChange} />

            <label>Password</label>
            <input type="password"
                className="border p-2 border-gray-200 rounded-sm"
                value={formData.password}
                id="password"
                name="password"
                onChange={handleOnChange} />
            <label>Phone</label>
            <input type="text"
                className="border p-2 border-gray-200 rounded-sm"
                value={formData.phone}
                id="phone"
                name="phone"
                onChange={handleOnChange} />
            <button type="submit" className="p-2 bg-green-300 hover:bg-green-400 transition cursor-pointer rounded-md text-white font-bold">Register</button>
        </form>
    )
}

export default RegisterForm