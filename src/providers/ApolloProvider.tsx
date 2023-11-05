import { ApolloClient, InMemoryCache, ApolloProvider as ReactApolloProvicer } from '@apollo/client';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

const ApolloProvider: FC<Props> = ({ children }) => {
  return (
    <ReactApolloProvicer client={client}>
      {children}
    </ReactApolloProvicer>
  )
}

export default ApolloProvider