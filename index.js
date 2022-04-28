require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { PATH, PORT } = require('./config/constant');

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => context,
});

server.start().then(() => {
  server.applyMiddleware({ PATH, app });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
