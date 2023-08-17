const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        singleUser: async (parent, { user = null, params }, res) => {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              });
          
              if (!foundUser) {
                return res.status(400).json({ message: 'Cannot find a user with this id!' });
              }
          
              res.json(foundUser);
        },
        // or should I query saved books?
        books: async () => {
            return Book.find({});
        },
    },

    Mutation: {
        createUser: async (parent, args, res) => {
            try {
                const user = await User.create(args);

                if (!user) {
                    return res.status(400).json({
                        message: 'Something is wrong!'
                    });
                }

                const token = signToken(user);
                return res.json({ token, user });
            } catch (err) {
                return res.status(500).json(err);
            }
        },
        saveBook: async (parent, args, res) => {
            console.log(args);
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: args._id },
                    { $addToSet: {savedBooks: args.book } },
                    { runValidators: true, new: true }
                )
    
                if(!updatedUser) {
                    return res.status(404).json({ message: 'No user found with that ID :('})
                };
    
                return res.json(updatedUser);
            } catch(err) {
                console.log(err);
                return res.status(500).json(err);
            }
       },
       deleteBook: async (parent, args, res) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: args.user._id },
                { $pull: {savedBooks: {bookId: args.bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'Couldnt find user with this ID! '});
            }
            return res.json(updatedUser);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
       },
    }
}