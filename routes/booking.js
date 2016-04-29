var db = require('../db.js');
var express = require('express');
var router = express.Router();


/*this function is the core of our app, it inserts the passenger data into the database,
  updates the selected seat and inserts the booking object into the database*/

router.post("/booking", function(req, res) {

  if (req.headers['other-hosts'] == 'false') {

    var passenger = req.body.passenger;
    var booking = req.body.booking;
    var exitFlightID = booking.refExitFlightID;
    var returnFlightID = booking.refReEntryFlightID;
    var bookingID;
    var passengersIDs = [];
    var exitIsEconomy, reEntryIsEconomy;
    var outgoingSeatNumber, returnSeatNumber;

    db.postPassengers(passenger, function(err, data) {

      if (!err) {

        passengersIDs.push(data.ops[0]._id);
        booking.refPassengerID.push(passengersIDs[0]);

        db.postBooking(booking, function(err, data) {

          if (!err) {

            bookingID = data.ops[0]._id;
            exitIsEconomy = booking.exitIsEconomy;
            outgoingSeatNumber = req.body.outgoingSeatNumber;

            res.send("Your booking was submitted successfully");

            db.updateFlight(false, exitFlightID, exitIsEconomy, outgoingSeatNumber, passengersIDs, bookingID, function(err, data) {

              if (!err) {

                if (returnFlightID) {

                  reEntryIsEconomy = booking.reEntryIsEconomy;
                  returnSeatNumber = req.body.returnSeatNumber;

                  db.updateFlight(false, returnFlightID, reEntryIsEconomy, returnSeatNumber, passengersIDs, bookingID, function(err, data) {

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

    });

  } else {

    var passengers = req.body.booking.passengerDetails;
    var booking = req.body.booking;
    var exitFlightID = booking.outgoingFlightId;
    var returnFlightID = booking.returnFlightId;
    // l booking m7tag yt3ml mn l awl abl ma t post 3ashan l database f mongo tkon consistent
    var bookingID;
    var passengersIDs = []; //hatmlaholi Ids bas  (Ids ba3d l posting passengers) wenta bta3ml l "refPassengerID" lel booking obj bta3na abl ma t post-o
    var isEconomy = booking.class;
    //  var outgoingSeatNumber, returnSeatNumber;

  }

});

module.exports = router;
