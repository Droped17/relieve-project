"use client"

import { FormEvent, useState } from "react"

interface IFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

const Register = () => {

    const [formData, setFormData] = useState<IFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log(formData)
    }

    return (
        <div>
            <p>Register Page</p>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    value={formData.firstName}
                    id="firstName"
                    name="firstName"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    } />
                <input type="text"
                    value={formData.lastName}
                    id="lastName"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                />
                <input type="text"
                    value={formData.email}
                    id="email"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                />
                <input type="password"
                    value={formData.password}
                    id="password"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
                <input type="text"
                    value={formData.phone}
                    id="phone"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register