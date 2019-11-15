import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import dotenv from 'dotenv';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import seedMutations from './seed-mutations';

dotenv.config();

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.GRAPHQL_URI, fetch }),
  cache: new InMemoryCache(),
});

client
  .mutate({
    mutation: gql(seedMutations),
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
