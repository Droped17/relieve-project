import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String!  
    role: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }
`;
