var db = require('../db.js');
var express = require('express');
var router = express.Router();


// this route should return all the flights that matches the given params
router.get('/flights/search/:origin/:destination/:departingDate',function (req,res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
//  var flights=db.getFlights (origin,destination);
//   for(var i = 0;i<flights.length;i++){
//     if (flights[i].departureUTC == departingDate) {
// //      res.send(flights[i])
//       approvedFlights.push(flights[i])
//     }
//       }
// //  res.send(req.params)
//     res.send(approvedFlights)
db.getFlights(origin,destination,departingDate,null,true,function(err,flights)
{
if(!err){
// res.send('outgoingFlights: ');
res.send(flights);

}else{
  console.log(err);
}

});

});


// not so sure about this one, but it's included in the sprint description
router.get('/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
  var returningDate = req.params.returningDate;
  var flightClass = req.params.class;

  db.getFlights(origin,destination,departingDate,returningDate,true,function(err,flights)
{
  if(!err){
      var approvedFlights=[];
      var approvedFlights2=[];
         for(var i = 0;i<flights.length;i++){
            if(flights[i].departureUTC==departingDate){
             if(flightClass == 'Economy'){
               if(flights[i].emptyEconomySeatsCount>1)
      //          res.send(flights[i])
                approvedFlights.push(flights[i])
             }
             else{
               if(flights[i].emptyBusinessSeatsCount>1)
               approvedFlights.push(flights[i])
             }

           }else{
             if(flightClass == 'Economy'){
               if(flights[i].emptyEconomySeatsCount>1)
      //          res.send(flights[i])
                approvedFlights2.push(flights[i])
             }
             else{
               if(flights[i].emptyBusinessSeatsCount>1)
               approvedFlights2.push(flights[i])
             }
           }
         }
//          res.send('outgoingFlights: ');
          res.send(approvedFlights);
//          res.send('returnFlights: ');
//          res.send(approvedFlights2);


  }else{
    consolse.log(err);
  }

});
});


//   var approvedFlights = [];
//   var approvedFlights2=[];
//      res.send('outgoing Flights: ')
//      for(var i = 0;i<flights.length;i++){
//        if (flights[i].departureUTC == departingDate)  {
//          if(flightClass == 'Economy'){
//            if(flights[i].emptyEconomySeatsCount>1)
//   //          res.send(flights[i])
//             approvedFlights.push(flights[i])
//          }
//          else{
//            if(flights[i].emptyBusinessSeatsCount>1)
//   //        res.send(flight[i])
//          approvedFlights.push(flights[i])
//          }
//
//          }
//            }
//            res.send(approvedFlights)
//            res.send('returning Flights: ')
//            for(var i = 0;i<flights.length;i++){
//              if (flights[i].arrivalUTC == returningDate)  {
//                if(flightClass == 'Economy'){
//                  if(flights[i].emptyEconomySeatsCount>1)
//   //                res.send(flights[i])
//                   approvedFlights2.push(flights[i])
//                }
//                else{
//                  if(flights[i].emptyBusinessSeatsCount>1)
// //                res.send(flight[i])
//                approvedFlights2.push(flights[i])
//                }
//
//                }
//                  }
//                res.send(approvedFlights2)
  //             res.send(req.params)



// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/oneway',function (req,res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  //   var appFlights=[];
  //   var flights=db.getFlights (origin,destination);
  //   for(var i = 0;i<flights.length;i++){
  //     if (flights[i].departureUTC == departingDate) {
  //   //      res.send(flights[i])
  //      appFlights.push(flights[i])
  //     }
  //       }
 //  res.send(req.body)
  //     res.send(appFlights)
 //      res.send(req.body)

 db.getFlights(origin,destination,departingDate,returningDate,true,function(err,flights)
{
 if(!err){
   res.send('outgoingFlights: ');
     var approvedFlights=[];
        for(var i = 0;i<flights.length;i++){
            if(flightClass == 'Economy'){
              if(flights[i].emptyEconomySeatsCount>1)
     //          res.send(flights[i])
               approvedFlights.push(flights[i])
            }
            else{
              if(flights[i].emptyBusinessSeatsCount>1)
              approvedFlights.push(flights[i])
            }
          }
          res.send(approvedFlights);

 }else{
   consolse.log(err);
 }

 });
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/roundtrip', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var returningDate = req.body.returningDate;
  var flightClass = req.body.class;
  db.getFlights(origin,destination,departingDate,returningDate,false,function(err,flights)
{
  if(!err){
      var approvedFlights=[];
      var approvedFlights2=[];
         for(var i = 0;i<flights.length;i++){
            if(flights[i].departureUTC==departingDate){
             if(flightClass == 'Economy'){
               if(flights[i].emptyEconomySeatsCount>1)
      //          res.send(flights[i])
                approvedFlights.push(flights[i])
             }
             else{
               if(flights[i].emptyBusinessSeatsCount>1)
               approvedFlights.push(flights[i])
             }

           }else{
             if(flightClass == 'Economy'){
               if(flights[i].emptyEconomySeatsCount>1)
      //          res.send(flights[i])
                approvedFlights2.push(flights[i])
             }
             else{
               if(flights[i].emptyBusinessSeatsCount>1)
               approvedFlights2.push(flights[i])
             }
           }
         }
//          res.send('outgoingFlights: ');
          res.send(approvedFlights);
//          res.send('returnFlights: ');
//          res.send(approvedFlights2);


  }else{
    consolse.log(err);
  }

  });

//   var approvedFlights=[];
//   var approvedFlights2=[];
//   var flights=db.getFlights (origin,destination);
//   res.send('outgoing Flights: ')
//   for(var i = 0;i<flights.length;i++){
//     if (flights[i].departureUTC == departingDate) {
//       if(flightClass == 'Economy'){
//         if(flights[i].emptyEconomySeatsCount>1)
// //        res.send(flights[i])
//         approvedFlights.push(flights[i])
//       }else{
//         if(flights[i].emptyBusinessSeatsCount>1)
// //        res.send(flights[i])
//         approvedFlights.push(flights[i])
//       }
//
//       }
//         }
//         res.send(approvedFlights)
//         res.send('returning Flights: ')
//         for(var i = 0;i<flights.length;i++){
//           if (flights[i].arrivalUTC == returningDate) {
//             if(flightClass == 'Economy'){
//               if(flights[i].emptyEconomySeatsCount>1)
// //              res.send(flights[i])
//               approvedFlights2.push(flights[i])
//
//             }else{
//               if(flights[i].emptyBusinessSeatsCount>1)
// //              res.send(flights[i])
//               approvedFlights2.push(flights[i])
//
//             }
//
//             }
//               }
//  res.send(req.body)
              // res.send(approvedFlights2)
              // res.send(req.body)


})

module.exports = router;
