const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const pool = require('./db');

const WorkoutType = new GraphQLObjectType({
  name: 'Workout',
  fields: () => ({
    id: { type: GraphQLInt },
    user_id: { type: GraphQLString  },
    name: { type: GraphQLString },
    duration: { type: GraphQLInt }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    listWorkouts: {
      type: new GraphQLList(WorkoutType),
      resolve: async (_, __, context) => {
        const result = await pool.query('SELECT * FROM workouts WHERE user_id = $1', [context.user.id]);
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        duration: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, args, context) => {
        const { name, duration } = args;
        const user_id = context.user.id;
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
