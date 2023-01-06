const Event = require('../../models/event');
const User = require('../../models/user');

const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { 
            ...user._doc ,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    })
    .catch(err => {
        throw err;
    });
}

const event = eventId => {
    return Event.findById(eventId)
    .then(event => {
        return { 
            ...event._doc ,
            date: dateToString(event._doc.date),
            creator: user.bind(this, event.creator)
        };
    })
    .catch(err => {
        throw err;
    });
};

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return transformEvent(event);
        });
    })
    .catch(err => {
        throw err;
    });
};

exports.user = user;
exports.event = event;
exports.events = events;