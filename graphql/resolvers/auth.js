const bcrpypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: (args) => {
    return User.findOne({email: args.userInput.email})
        .then(user => {
            if(user) {
                throw new Error("User exists already!")
            }
            return bcrpypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
            user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            return user.save();
        })
        .then(result => {
            return {...result._doc, password: null};
        })
        .catch(err => {
            throw err;
        });
    },
    login: (args) => {
        let userId;
        let userEmail;
        return User.findOne({ email: args.loginInput.email })
        .then(user => {
            if(!user) {
                throw new Error("User does not exist.");
            }
            userId = user.id;
            userEmail = user.email;
            return bcrpypt.compare(args.loginInput.password, user.password)
        })
        .then(isEqual => {
            if(!isEqual) {
                throw new Error("Incorrect password");
            }
            return jwt.sign({userId: userId, email: userEmail}, 'somesupersecretkey', {expiresIn: '1hr'})
        })
        .then(token => {
            return {
                userId: userId,
                token: token,
                tokenExpiration: 1
            }
        })
        .catch(err => {
            throw err;
        })

    }
};

