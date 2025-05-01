import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
     mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, phone: String!): User!
  }
`