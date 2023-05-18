import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject
} from '@apollo/client'
import invariant from 'tiny-invariant'

import { introspectionResult } from '@plateau/graphql'

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  invariant(
    process.env.NEXT_PUBLIC_API_BASE_URL != null,
    'Missing environment variable: NEXT_PUBLIC_API_BASE_URL'
  )
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
