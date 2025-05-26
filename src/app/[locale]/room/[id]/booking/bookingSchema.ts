import { z } from "zod"

// [TODO]: Localization Error Message
// t: (key: string) => string
export const BookingSchema = () => {
   return z.object({
        firstName: z.string().trim().nonempty({message: 'Firstname is required'}),
        lastName: z.string().trim().nonempty({message: 'Lastname is required'}),
        email: z.string().email({ message: 'Invalid email' }).trim(),
        phone: z.string().min(10, {message: 'Invalid Phone'}),
    })
}

