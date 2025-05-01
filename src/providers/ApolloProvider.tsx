'use client'

import { ApolloProvider } from '@apollo/client/react'
import client from '@/src/app/lib/apollo-client'

export default function ApolloProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
