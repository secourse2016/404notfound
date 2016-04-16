var db = require('../db.js');
var express = require('express');
var router = express.Router();


//this function is the core of our app, it inserts the passenger data into the database,
// update the selected seat and insert the booking object into the database
router.post("/booking",function(req,res){
var Passenger= req.body.passenger;
var booking=req.body.booking;
var flightNumber=booking.refExitFlightNumber;
var bookingId;
var passengerId;
var exitDate;
var isEconomy;
var seatNumber;

db.postPassenger(Passenger,function(err, data){
  if(!err){
  passengerId = data._id;
  res.send('Passenger added succefully');
}
else{
  res.send('error occured while adding passenger');
}
});
db.postBooking(booking,function(err,data ){
  if(!err){
    bookingId = data._id;
  res.send('booking added succefully');
}
else{
  res.send('error occured while adding booking');
}
});
var seat = {
    number : req.body.seatNumber,
    isEmpty  : "false",
    isEconomy : "true",
    isAisle  : "true",
    hasSmoking  : "false",
    hasScreen  : "true",
    refBookingID  : bookingId,
    refPassengerID  : passengerId
};
isEconomy= booking.isEconomy;
seatNumber=req.body.seatNumber;
exitDate=booking.exitDepartureUTC;
db.updateFlight(flightNumber, exitDate,isEconomy,seatNumber,passengerId,bookingId,function(err,data){
   if(!err){
 res.send('seat added succefully');
}
   else{
 res.send('error occured while adding seat');
}
});
})

module.exports = router;
