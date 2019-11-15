import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
