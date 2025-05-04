import { z } from "zod"

// [TODO]: Localization Error Message
// t: (key: string) => string
export const LoginSchema = () => {
   return z.object({
        email: z.string().email({ message: 'Invalid email' }).trim(),
        password: z.string().min(8, { message: 'Invalid password' }).trim().refine(
            (value) => /[A-Z]/.test(value) // At least one uppercase letter
        )
            .refine(
                (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) // At least one special character
            )
            .refine(
                (value) => /\d/.test(value) // At least one number
            ),
    })
}

