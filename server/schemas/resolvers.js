const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    async me(_, __, context) {
      if (context.req.user) {
        return await User.findById(context.req.user._id);
      }
      throw new AuthenticationError('You need to be logged in!');
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
    async saveBook(parent, {bookData}, context) {
      if (context.req.user) {
        let filter = {_id: context.req.user._id }
        const user = await User.findOneAndUpdate(filter, {$push: {savedBooks: bookData}}, {new:true});
 
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
    
    async removeBook(parent, { bookId }, context) {
     
      if (context) {
        let index = context.req.body.variables.bookId
        const user = await User.findById(context.req.user._id)

        let savedBooks = user.savedBooks
        savedBooks.splice(index, 1)
        user.save()

       
        return user;
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
  },
};

module.exports = resolvers;
