const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    async me(_, { ID }) {
      return await User.findById(ID);
    },
 
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    async addUser(_, { email, username, password }){
      const user = await User.create({
        email: email,
        username: username,
        password: password,
      });
      const token = signToken(user);

      return { token, user };
    },
    async saveBook(_, { author, title, bookId, image, link }, context) {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: { author, title, bookId, image, link } } },
          { new: true }
        );
        return user;
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
    async removeBook(_, { bookId }, context) {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return user;
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
  },
};

module.exports = resolvers;

