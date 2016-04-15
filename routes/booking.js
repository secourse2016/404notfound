var db = require('../db.js');
var express = require('express');
var router = express.Router();


//this function is the core of our app, it inserts the passenger data into the database,
// update the selected seat and insert the booking object into the database
router.post("/booking",function(req,res){
var Passenger= req.body.passenger;
var booking=req.body.booking;
var flightNumber=booking.refExitFlightNumber;
var seat = {
    number : req.body.seatNumber,
    isEmpty  : "no",
    isEconomy : "yes",
    isAisle  : "yes",
    hasSmoking  : "no",
    hasScreen  : "yes",
    refBookingID  : booking._id,
    refPassengerID  : Passenger._id
};
db.postPassenger(Passenger,function(err, cb){
  if(!err){
  res.send('Passenger added succefully');
}
else{
  res.send('error occured while adding passenger');
}
})
db.postBooking(booking,function(err,cb ){
  if(!err){
  res.send('booking added succefully');
}
else{
  res.send('error occured while adding booking');
}
})
db.updateFlight(flightNumber, seat,function(err,cb))
   if(!err){
 res.send('seat added succefully');
}
   else{
 res.send('error occured while adding seat');
}})

module.exports = router;
