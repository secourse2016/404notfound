var db = require('../db.js');
var express = require('express');
var router = express.Router();


//this function is the core of our app, it inserts the passenger data into the database,
// update the selected seat and insert the booking object into the database
router.post("/booking", function(req, res) {
    var Passenger = req.body.passenger;
    var booking = req.body.booking;
    var exitFlightID = booking.refExitFlightID;
    var returnFlightID = booking.refReEntryFlightID;
    var bookingId;
    var passengerId;
    var exitIsEconomy, reEntryIsEconomy;
    var outgoingSeatNumber, returnSeatNumber;
    // console.log(booking)

    db.postPassenger(Passenger, function(err, data) {
        if (!err) {
            passengerId = data.ops[0]._id;
            booking.refPassengerID = passengerId;
            db.postBooking(booking, function(err, data) {
                if (!err) {
                    bookingId = data.ops[0]._id;
                    exitIsEconomy = booking.exitIsEconomy;
                    outgoingSeatNumber = req.body.outgoingSeatNumber;

                    res.send("Your booking was submitted succefully");
                    db.updateFlight(exitFlightID, exitIsEconomy, outgoingSeatNumber, passengerId, bookingId, function(err, data) {
                        if (!err) {
                          if (returnFlightNumber) {
                              reEntryIsEconomy = booking.reEntryIsEconomy;
                              returnSeatNumber = req.body.returnSeatNumber;

                              db.updateFlight(returnFlightID, reEntryIsEconomy, returnSeatNumber, passengerId, bookingId, function(err, data) {
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
