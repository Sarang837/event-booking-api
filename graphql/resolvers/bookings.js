const { dateToString } = require('../../helpers/date');
const Booking = require('../../models/booking');
const { user, event } = require('./merge');

const transformBooking = booking => {
    return {
        ...booking._doc,
        event: event.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};

module.exports = {
    bookings: () => {
        return Booking
        .find()
        .then(bookings=> {
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        })
        .catch(err => {
            throw err;
        });
    },
    bookEvent: (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthorized");
        }
        booking = new Booking({
            event: args.eventId,
            user: '63b2b2a6f591801bb46d0d20'
        });
        return booking
        .save()
        .then(result => {
            return transformBooking(result)

        })
        .catch(err => {
            throw err;
        });
    },
    cancelBooking: (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthorized");
        }
        let bookedEvent;
        return Booking.findById(args.bookingId)
        .populate('event')
        .then(booking => {
            // console.log(booking.event._doc)
            bookedEvent = transformEvent(booking.event);
            return Booking.deleteOne({_id: args.bookingId})
        })
        .then(result => {
            return {...bookedEvent};
        })
        .catch(err => {
            throw err;
        })
    }
};

