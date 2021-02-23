import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache,
} from '@apollo/client';

const cache = new InMemoryCache();

const link = ApolloLink.from([
  new HttpLink({}),
]);

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
