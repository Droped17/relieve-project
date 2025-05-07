import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum ERoomStatus {
    empty
    full
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
  id: ID!
  number: String!
  detail: [String!]!
  price: Float!
  floor: Int!
  image: [String!]!
  personPerRoom: Int!
  status: ERoomStatus!
}

  type Query {
    users: [User!]!
    rooms: [Room!]!
    findRoomBy(id: ID, floor: Int, status: ERoomStatus): [Room!]!
  }


  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }

  type Mutation {
    createRoom(number: String!, detail: [String!]!, price: Float!, floor: Int!, image: [String]!, status: ERoomStatus!, personPerRoom: Int!): Room!
  }

`;
