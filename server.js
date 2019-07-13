const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Bring in GraphQL Express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Create Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected!'))
  .catch(err => console.error(err));

// Initialize application
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // for Apollo Client to work correctly
};
app.use(cors(corsOptions));

// Create GraphiQL Application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Connect schemas to GraphQL
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      Recipe,
      User,
    },
  })
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
