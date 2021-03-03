import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import apolloClient from '../apollo-client';
import store from '../store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // if (loading) return (<div>...loading</div>);
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ReduxProvider>
  );
}

export default MyApp;
