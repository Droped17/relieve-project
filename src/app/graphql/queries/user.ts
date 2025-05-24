import { gql } from 'graphql-tag';

export const typeDefs = gql`
  directive @auth(requires: Role = USER) on FIELD_DEFINITION

  enum Role {
    USER
    ADMIN
  }

  enum ERoomStatus {
    EMPTY
    FULL
    NULL_VALUE
  }

  enum EStatus {
    SUCCESS
    ERROR
  }
  
  enum ETransactionStatus {
    PENDING
    PAID
    NOT_PAID 
}

type TransactionResponse {
  status: EStatus!
  message: String!
  data: Transaction
}

type Guest {
  firstName: String
  lastName: String
  email: String
  phone: String
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
  nights: Int!
  personPerRoom: Int!
  request: String
  guest: GuestInput
}

input CreateRoomInput {
  number: String!
  detail: [String!]! 
  price: Float!
  floor: Int!
  personPerRoom: Int!
  image: [String!]!
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
  publicId: String
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
  personPerRoom: Int!
  guest: Guest! 
  request: String
  user: User!
  room: Room!
}

type Transaction {
  _id: ID
  totalPrice: Int
  request: String
  image: String
  status: ETransactionStatus
  createdAt: String!
  updatedAt: String!
  user: [User!]
  booking: [Booking!]
}

type Query {
  myProfile: User
  publicData: String
  userData: String @auth
  adminData: String @auth(requires: ADMIN)
  protectedData: String
  me: [User!]!
  users: [User!]!
  transaction: [Transaction!]!
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
  findTransactionBy(id: ID): TransactionResponse!
  booking: [Booking!]!
  allRooms(date: String!, nights: Int!, personPerRoom: Int!, floor: Int): [Room!]!
}


  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }

  extend type Mutation {
    createRoom(input: CreateRoomInput!): Room!
  }

  type Mutation {
    createTransaction(totalPrice: Int!): Transaction!
  }

  type EmailResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    sendContactEmail(to: String!, subject: String!, message: String!): EmailResponse!
  }

  type Mutation {
   uploadImage(imageUrl: String!, transactionId: ID!): Boolean!
  }

extend type Mutation {
  createBooking(input: CreateBookingInput!): Booking!
}

`;
