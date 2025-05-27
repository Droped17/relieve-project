import { z } from "zod"

// [TODO]: Localization Error Message
// t: (key: string) => string
export const BookingSchema = () => {
    return z.object({
        firstName: z.string().trim().nonempty({ message: 'Firstname is required' }).regex(/^[A-Za-z]+$/, { message: 'Firstname must contain only letters' }),
        lastName: z.string().trim().nonempty({ message: 'Lastname is required' }).regex(/^[A-Za-z]+$/, { message: 'Lastname must contain only letters' }),
        email: z.string().email({ message: 'Invalid email' }).trim(),
        phone: z
            .string()
            .trim()
            .regex(/^\d+$/, { message: 'Phone must contain only numbers' })
            .min(10, { message: 'Phone must be at least 10 digits' }),
    })
}

