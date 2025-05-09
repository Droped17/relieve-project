import { z } from "zod"

// [TODO]: Localization Error Message
// t: (key: string) => string
export const LoginSchema = () => {
   return z.object({
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
    })
}

