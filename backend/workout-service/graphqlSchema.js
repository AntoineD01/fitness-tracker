const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const pool = require('./db');

const WorkoutType = new GraphQLObjectType({
  name: 'Workout',
  fields: () => ({
    id: { type: GraphQLInt },
    user_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    duration: { type: GraphQLInt }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    listWorkouts: {
      type: new GraphQLList(WorkoutType),
      resolve: async () => {
        const result = await pool.query('SELECT * FROM workouts');
        return result.rows;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addWorkout: {
      type: WorkoutType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        duration: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, args) => {
        const { user_id, name, duration } = args;
        const result = await pool.query(
          'INSERT INTO workouts (user_id, name, duration) VALUES ($1, $2, $3) RETURNING *',
          [user_id, name, duration]
        );
        return result.rows[0];
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
