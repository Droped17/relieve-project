import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum ERoomStatus {
    empty
    full
    null_value
  }

  enum ETransactionStatus {
    PENDING
    PAID
    NOT_PAID 
}


  enum EBookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

  enum RoomAvailabilityStatus {
  full
  empty
  unavailable
  null_value
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
  createdAt: String!
  updatedAt: String!
  availabilityStatus: RoomAvailabilityStatus
}

type Booking {
  _id: ID!
  status: EBookingStatus!
  createdAt: String!
  updatedAt: String!
  user: [User!]!
  transaction: [Transaction!]!
  room: Room!
  dateEnd: String!
  numberOfPeople: Int!
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
    dateStart: String
    nights: Int
    personPerRoom: Int
  ): [Room!]!
  booking: [Booking!]!
}


  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }

  type Mutation {
    createRoom(number: String!, detail: [String!]!, price: Float!, floor: Int!, image: [String]!, status: ERoomStatus!, personPerRoom: Int!): Room!
  }

  type Mutation {
    createTransaction(totalPrice: Int!): Transaction!
  }

`;
