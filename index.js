require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const connectToDB = require('./utils/dbConnect');

const path = '/graphql';
const port = 4000;

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => context,
});

connectToDB();
server.start().then(() => {
  server.applyMiddleware({ path, app });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
