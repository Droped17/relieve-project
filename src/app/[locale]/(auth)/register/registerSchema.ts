import { z } from "zod"

// [TODO]: Localization Error Message
// t: (key: string) => string
export const RegisterSchema = () => {
   return z.object({
        firstName: z.string().trim().nonempty({message: 'Firstname is required'}),
        lastName: z.string().trim().nonempty({message: 'Lastname is required'}),
        email: z.string().email({ message: 'Invalid email' }).trim(),
        password: z.string().min(8, { message: 'Invalid password' }).trim().refine(
            (value) => /[A-Z]/.test(value), {message: 'Must include uppercase letter'} // At least one uppercase letter
        )
            .refine(
                (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {message: "Must include Special Character"} // At least one special character
            )
            .refine(
                (value) => /\d/.test(value), {message: "Must include a number"} // At least one number
            ),
        phone: z.string().min(10, {message: 'Invalid Phone'})
    })
}

