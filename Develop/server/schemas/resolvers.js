const { Book, User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find({});
    },
    user: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return User.findOne(params);
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Whoops");
      }
      const rightPassword = await user.isCorrectPassword(password);
      if (!rightPassword) {
        throw new AuthenticationError("Whoops");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (
      parent,
      { authors, description, bookId, image, link, title },
      context
    ) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { authors, description, bookId, image, link, title },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError("Not correct");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId: bookId },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("Not Correct");
    },
  },
};

module.exports = resolvers;
