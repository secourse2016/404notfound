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
    var passengersIds = [];
    var exitIsEconomy, reEntryIsEconomy;
    var outgoingSeatNumber, returnSeatNumber;
    // console.log(booking)

    db.postPassengers(Passenger, function(err, data) {
        if (!err) {
            if (req.headers['other-hosts'] == 'false') {
            passengersIds.push(data.ops[0]._id);
            booking.refPassengerID.push(passengersIds[0]);
            db.postBooking(booking, function(err, data) {
                if (!err) {
                    bookingId = data.ops[0]._id;
                    exitIsEconomy = booking.exitIsEconomy;
                    outgoingSeatNumber = req.body.outgoingSeatNumber;

                    res.send("Your booking was submitted succefully");
                    db.updateFlight(false, exitFlightID, exitIsEconomy, outgoingSeatNumber, passengersIds, bookingId, function(err, data) {
                        if (!err) {
                          if (returnFlightID) {
                              reEntryIsEconomy = booking.reEntryIsEconomy;
                              returnSeatNumber = req.body.returnSeatNumber;

                              db.updateFlight(false, returnFlightID, reEntryIsEconomy, returnSeatNumber, passengersIds, bookingId, function(err, data) {
                                  if (!err) {
                                    res.send({
                                                  refNum: booking.receiptNumber,
                                                  errorMessage: err
                                              });
                                    console.log('successfully added your booking');
                                    return;
                                  } else {
                                    res.send({
                                                  refNum: booking.receiptNumber,
                                                  errorMessage: err
                                              });
                                      console.log('error occured while adding your booking');
                                      return;
                                  }
                              });
                          }
                        } else {
                          res.send({
                                        refNum: booking.receiptNumber,
                                        errorMessage: err
                                    });
                            console.log('error occured while adding your booking');
                            return;
                        }
                    });
                }
            });
          }
          else{

          }
        }
    });




})

module.exports = router;
