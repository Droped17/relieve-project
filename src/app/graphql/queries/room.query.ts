import { gql } from "@apollo/client";

export const FIND_ROOMS_BY_ID = gql`
  query FindRoomBy($input: FindRoomByInput!) {
    findRoomBy(input: $input) {
      number
      detail
      price
      image
    }
  }
`;

export const GET_ALL_ROOMS = gql`
  query AllRooms($date: String!, $nights: Int!, $personPerRoom: Int!, $floor: Int) {
    allRooms(date: $date, nights: $nights, personPerRoom: $personPerRoom, floor: $floor) {
      _id
      floor
      number
      status
      isBooked
    }
  }
`

export const COUNT_EMPTY_ROOMS = gql`
  query CountRoom {
    countEmptyRooms
  }
`

export const YEAR_DETAIL = gql`
  query TotalCustomer {
    totalCustomer {
      status
      message
      data {
        totalUsers
        totalRooms
        totalIncome
      }
    }
  }
`

