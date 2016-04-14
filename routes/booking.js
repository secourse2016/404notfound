var db = require('../db.js');
var express = require('express');
var router = express.Router();


//this function is the core of our app, it inserts the passenger data into the database,
// update the selected seat and insert the booking object into the database
router.post("/booking",function(req,res){
    var booking = req.body.booking;
    var passenger = req.body.passenger;
    db.postPassenger(passenger);
    db.postBooking(booking);
    var flightNumExit=booking.refExitFlightNumber;
    var flightNumEnter=booking.refReEntryFlightNumber;
    
    res.send('Successfully booked!!')
})

module.exports = router;
