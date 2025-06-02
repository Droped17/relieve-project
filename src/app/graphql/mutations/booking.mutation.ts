import { gql } from "@apollo/client";

/* MUTATION */
export const CREATE_BOOKING = gql`
mutation CreateBooking($input: CreateBookingInput!){
    createBooking(input: $input) {
        _id
        checkIn
        checkOut
        request
        room {
            _id
        }
    }
}
`