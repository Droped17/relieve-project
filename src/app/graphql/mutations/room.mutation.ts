import { gql } from "@apollo/client";

/* MUTATION */
export const CREATE_ROOM = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
        createRoom(input: $input) {
            _id
            floor
            detail
            number
            personPerRoom
            price
        }
    }
`