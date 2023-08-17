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
        createUser: async (parent, body, res) => {
            try {
                const user = await User.create(body);

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
        // is login query or mutation?
        login: async (parent, body, res) => {
            try {
                const user = await User.findOne(
                    { $or: [{username: body.username }, { email: body.email }] });
                
                if (!user) {
                    return res.status(400).json({ message: "Can't find this user!"});
                }

                const correctPw = await user.isCorrectPassword(body.password);

                if (!correctPassword) {
                    return res.status(400).json({ message: 'wrong apssword!' });
                }

                const token = signToken(user);
                res.json({ token, user });
            } catch (err) {
                return res.status(500).json(err);
            }
        },
        saveBook: async (parent, {_id, book}, res) => {
            console.log(body);
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: _id },
                    { $addToSet: {savedBooks: book } },
                    { runValidators: true, new: true }
                )
    
                if(!updatedUser) {
                    return res.status(404).json({ message: 'No user found with that ID :('})
                };
    
                return res.json(updatedUser);
            } catch (err) {
                console.log(err);
                return res.status(500).json(err);
            }
       },
       deleteBook: async (parent, { _id, book}, res) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: _id },
                { $pull: {savedBooks: {bookId: book} } },
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

module.exports = resolvers;