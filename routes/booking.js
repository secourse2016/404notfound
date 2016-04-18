var db = require('../db.js');
var express = require('express');
var router = express.Router();


//this function is the core of our app, it inserts the passenger data into the database,
// update the selected seat and insert the booking object into the database
router.post("/booking", function(req, res) {
    var Passenger = req.body.passenger;
    var booking = req.body.booking;
    var exitFlightNumber = booking.refExitFlightNumber;
    var returnFlightNumber = booking.refReEntryFlightNumber;
    var bookingId;
    var passengerId;
    var exitDate;
    var returnDate;
    var isGoingEconomy, isReturningEconomy;
    var outgoingSeatNumber, returnSeatNumber;


    db.postPassenger(Passenger, function(err, data) {
        if (!err) {
            passengerId = data.ops[0]._id;
            db.postBooking(booking, function(err, data) {
                if (!err) {
                    bookingId = data.ops[0]._id;
                    isGoingEconomy = booking.isGoingEconomy;
                    outgoingSeatNumber = req.body.outgoingSeatNumber;
                    exitDate = booking.exitDepartureUTC;

                    db.updateFlight(exitFlightNumber, exitDate, isGoingEconomy, outgoingSeatNumber, passengerId, bookingId, function(err, data) {
                        if (!err) {
                          if (returnFlightNumber) {
                              isReturningEconomy = booking.isReturningEconomy;
                              returnSeatNumber = req.body.returnSeatNumber;
                              returnDate = booking.reEntryDepartureUTC;
                              db.updateFlight(returnFlightNumber, exitDate, isReturningEconomy, returnSeatNumber, passengerId, bookingId, function(err, data) {
                                  if (!err) {
                                    res.send('booking added succefully');
                                  } else {
                                    res.send(err);
                                      console.log('error occured while adding your booking');
                                      return;
                                  }
                              });
                          }
                        } else {
                          res.send(err);
                            console.log('error occured while adding your booking');
                            return;
                        }
                    });
                }
            });

        }
    });




})

module.exports = router;
