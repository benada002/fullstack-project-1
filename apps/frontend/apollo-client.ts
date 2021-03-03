import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import {
  fetchAccessToken,
  getAccessToken,
  isAccessTokenUndefined,
  isAccessTokenValidOrUndefined as isTokenValidOrUndefined,
  dispatchAccessToken,
  dispatchError,
} from './access-token';
import { GRAPHQL_URL } from './constants';

const cache = new InMemoryCache();

const authLink = setContext((_, { headers = {} }) => ({
  headers: {
    ...headers,
    ...!isAccessTokenUndefined() ? { authorization: `Bearer ${getAccessToken()}` } : {},
  },
}));

const link = ApolloLink.from([
  new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined,
    fetchAccessToken,
    handleFetch: (accessToken) => dispatchAccessToken(accessToken),
    handleError: (err) => dispatchError(err),
  }),
  authLink,
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ));
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new HttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include',
  }),
]);

const apolloClient = new ApolloClient({
  link,
  cache,
});

export default apolloClient;
