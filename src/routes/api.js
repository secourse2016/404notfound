import { Router } from 'express';

export default ({ db }) => {
  const api = Router();

  api.get('/airports', (req, res) => {
    res.json(db.getAirports());
  });

  api.get('/countries', (req, res) => {
    res.json(db.getCountries());
  });

  api.get('/flights/:originAirportIata/:destinationAirportIata/:departureDate', (req, res) => {
    const params = {
      originAirportIata: req.params.originAirportIata,
      destinationAirportIata: req.params.destinationAirportIata,
      departureDate: req.params.departureDate,
    };

    db.searchFlights(params).then((flights) => {
      if (flights.length === 0) {
        // 204 No Content
        res.status(204).json({ outgoingFlights: flights });
      } else {
        // 200 OK
        res.json({ outgoingFlights: flights });
      }
    }).catch((err) => {
      // 500 Internal Server Error
      res.status(500).json({ err });
    });
  });

  api.post('/flights/book', (req, res) => {
    db.reserveSeat(req.body).then((booking) => {
      // 201 Created
      res.status(201).json(booking);
    }).catch((err) => {
      if (err.toString() === 'Unbookable') {
        // 409 Conflict
        res.status(409).json({ err });
      } else {
        // Internal Server Error
        res.status(500).json({ err });
      }
    });
  });

  return api;
};
