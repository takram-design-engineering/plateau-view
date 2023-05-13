import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject
} from '@apollo/client'

import { introspectionResult } from '@plateau/graphql'

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    cache: new InMemoryCache({
      possibleTypes: introspectionResult.possibleTypes
    }),
    link: ApolloLink.from([
      new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/graphql`
      })
    ])
  })
}
