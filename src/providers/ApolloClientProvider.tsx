import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { FC } from 'react'
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from '../configs'

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_GITHUB_TOKEN) ?? ''
  )
  // return the headers to the context so httpLink can read them

  console.log({ token })

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql'
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export const ApolloClientProvider: FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
