const { dateToString } = require('../../helpers/date');
const { user } = require('./merge');
const Event = require('../../models/event');
const User = require('../../models/user');

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

module.exports = {
    events: () => {
        return Event
        .find()
        // .populate('creator')
        .then(events => {
            return events.map(event => {
                return transformEvent(event);
            });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    },
    createEvent: (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthorized");
        }
        event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '63b2b2a6f591801bb46d0d20'
        });
        let createdEvent;
        return event
            .save()
            .then((result) => {
                createdEvent = transformEvent(result);
                return User.findById('63b2b2a6f591801bb46d0d20')

            })
            .then(user => {
                if(!user) {
                    throw new Error("User does not exist");
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            }) 
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
};

