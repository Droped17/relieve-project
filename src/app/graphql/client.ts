import { GraphQLClient } from "graphql-request"

// [TODO]: Check what grahql-request do

export const createGraphqlClient = (session) => {
    return new GraphQLClient('/api/grahpql', {
        headers: {
            authorization: session ? `Bearer ${session.token}` : ''
        }
    })
}