import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum ERoomStatus {
    EMPTY
    FULL
    NULL_VALUE
  }

  enum ETransactionStatus {
    PENDING
    PAID
    NOT_PAID 
}

type Guest {
  firstName: String!
  lastName: String!
  email: String
}

input GuestInput {
  firstName: String!
  lastName: String!
  email: String
  phone: String
}


input CreateBookingInput {
  roomId: ID!
  checkIn: String!
  checkOut: String!
  personPerRoom: Int!
}

type CreateBookingResponse {
  bookingId: ID!
}

enum EBookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!  
    role: String!
  }

type Room {
  _id: ID!
  number: String!
  detail: [String!]!
  price: Float!
  floor: Int!
  image: [String!]!
  personPerRoom: Int!
  status: ERoomStatus!
  availabilityStatus: String
  isBooked: Boolean
  createdAt: String!
  updatedAt: String!
}

type Booking {
  _id: ID!
  status: EBookingStatus
  createdAt: String!
  updatedAt: String!
  transaction: [Transaction!]!
  checkIn: String!
  checkOut: String!
  nights: Int!
  numberOfPeople: Int!
  guest: Guest! 
  request: String!
  user: User!
  room: Room!
}

type Transaction {
  _id: ID!
  totalPrice: Int!
  request: String!
  image: String!
  status: ETransactionStatus
  createdAt: String!
  updatedAt: String!
  user: [User!]!
}

type Query {
  users: [User!]!
  rooms(
    date: String
    nights: Int
    numberOfPeople: Int
  ): [Room!]!
  findRoomBy(
    id: ID
    floor: Int
    status: ERoomStatus
    date: String
    nights: Int
    numberOfPeople: Int
  ): [Room!]!
  booking: [Booking!]!
  allRooms(date: String!, nights: Int!, personPerRoom: Int!, floor: Int): [Room!]!
}


  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }

  type Mutation {
    createRoom(number: String!, detail: [String!]!, price: Float!, floor: Int!, image: [String]!, personPerRoom: Int!): Room!
  }

  type Mutation {
    createTransaction(totalPrice: Int!): Transaction!
  }

extend type Mutation {
  createBooking(input: CreateBookingInput!): Booking!
}

`;
