import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

 const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        credentials: 'include'
    }),
    cache: new InMemoryCache()
 })

 export default client