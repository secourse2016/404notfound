import { MongoClient, ObjectID } from 'mongodb';
import airportsJSON from '../mockdata/airports.json';
import countriesJSON from '../mockdata/countries.json';
import aircraftsJSON from '../mockdata/aircrafts.json';

export default class Database {
  constructor(config) {
    this.db = {};
    this.config = config;
    this.airports = airportsJSON;
    this.countries = countriesJSON;
    this.aircrafts = aircraftsJSON;
    this.flights = [];
    return this;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.config.uri, (err, db) => {
        if (err) reject(err);
        this.db = db;
        resolve(this);
      });
    });
  }

  drop() {
    this.db.dropDatabase();
  }

  getAirports() {
    return this.airports;
  }

  getCountries() {
    return this.countries;
  }

  searchFlights({ originAirportIata, destinationAirportIata, departureDate }) {
    const departureDateLowerBound = new Date(departureDate);
    const departureDateUpperBound = new Date(departureDate);

    departureDateLowerBound.setUTCHours(0, 0, 0, 0);
    departureDateUpperBound.setUTCHours(24, 0, 0, 0);

    return new Promise((resolve, reject) => {
      this.db.collection('flights').find({
        $and: [{
          'originAirport.iata': originAirportIata,
        }, {
          'destinationAirport.iata': destinationAirportIata,
        }, {
          departureUTC: {
            $gte: departureDateLowerBound,
            $lt: departureDateUpperBound,
          },
        }],
      },
        {
          _id: false,
          'aircraft.tailNumber': false,
          'aircraft.seating': false,
        }).toArray((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  reserveSeat({ flight, isEconomy, passenger }) {
    const bookingId = new ObjectID();

    return new Promise((resolve, reject) => {
      this.db.collection('flights').findAndModify(
        {
          $and: [{
            number: flight.number,
          }, {
            departureUTC: new Date(flight.departureUTC),
          },
          {
            [`aircraft.seating.${(isEconomy) ? 'economy' : 'business'}.map`]: {
              $elemMatch: { booking: null },
            },
          },
          ],
        }, {}, {
          $set: {
            [`aircraft.seating.${(isEconomy) ? 'economy' : 'business'}.map.$.booking`]: {
              _id: bookingId,
              passenger,
            },
          },
        }, { new: true }, (err, data) => {
          if (err) reject(err);
          if (!data.value) reject(new Error('Unbookable'));
          resolve({ _id: bookingId, flight, isEconomy, passenger });
        });
    });
  }

  assembleSeatmap(rowsCount, columnsHeaders) {
    let seatmap = Array(rowsCount).fill();
    seatmap = seatmap.map(() => (columnsHeaders.slice(0)));

    seatmap = seatmap.map((row, index) => {
      let assembledRow = row;

      assembledRow = assembledRow.map(letter => ({
        column: letter,
        row: index,
      }));

      return assembledRow;
    });

    return seatmap.reduce((flattenedSeats, row) => flattenedSeats.concat(row));
  }

  assembleAircrafts() {
    this.aircrafts = this.aircrafts.map((aircraft) => {
      const assembledAircraft = aircraft;

      const businessColumnsHeaders = assembledAircraft.seating.business.columnsHeaders;
      const businessRowsCount = assembledAircraft.seating.business.rowsCount;

      const economyColumnsHeaders = assembledAircraft.seating.economy.columnsHeaders;
      const economyRowsCount = assembledAircraft.seating.economy.rowsCount;

      assembledAircraft.seating.business.map =
        this.assembleSeatmap(businessRowsCount, businessColumnsHeaders).map(seat => ({
          number: seat.column.concat(seat.row),
          booking: null,
        }));

      assembledAircraft.seating.economy.map =
        this.assembleSeatmap(economyRowsCount, economyColumnsHeaders).map(seat => ({
          number: seat.column.concat(seat.row + businessRowsCount),
          booking: null,
        }));

      return assembledAircraft;
    });
  }

  generateFlights() {
    const daysCount = this.config.seeding.flights.daysCount;

    let londonToParis = Array(daysCount).fill();
    let dubaiToBeijing = Array(daysCount).fill();
    let frankfurtToLosAngeles = Array(daysCount).fill();
    let parisToLondon = Array(daysCount).fill();
    let beijingToDubai = Array(daysCount).fill();
    let losAngelesToFrankfurt = Array(daysCount).fill();

    let date = new Date();
    date.setUTCHours(0, 10, 0, 0);

    londonToParis = londonToParis.map(() => ({
      number: 'AB-1000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 75,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[0],
      originAirport: this.airports[0],
      destinationAirport: this.airports[1],
      economyFare: 50,
      businessFare: 100,
    }));

    date = new Date();
    date.setUTCHours(0, 10, 0, 0);

    dubaiToBeijing = dubaiToBeijing.map(() => ({
      number: 'AB-2000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 445,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[1],
      originAirport: this.airports[2],
      destinationAirport: this.airports[3],
      economyFare: 250,
      businessFare: 500,
    }));

    date = new Date();
    date.setUTCHours(0, 10, 0, 0);

    frankfurtToLosAngeles = frankfurtToLosAngeles.map(() => ({
      number: 'AB-3000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 710,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[2],
      originAirport: this.airports[4],
      destinationAirport: this.airports[5],
      economyFare: 350,
      businessFare: 600,
    }));

    date = new Date();
    date.setUTCHours(13, 0, 0, 0);

    parisToLondon = parisToLondon.map(() => ({
      number: 'AB-1000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 75,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[0],
      originAirport: this.airports[1],
      destinationAirport: this.airports[0],
      economyFare: 50,
      businessFare: 100,
    }));

    date = new Date();
    date.setUTCHours(13, 0, 0, 0);

    beijingToDubai = beijingToDubai.map(() => ({
      number: 'AB-2000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 445,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[1],
      originAirport: this.airports[3],
      destinationAirport: this.airports[2],
      economyFare: 250,
      businessFare: 500,
    }));

    date = new Date();
    date.setUTCHours(13, 0, 0, 0);

    losAngelesToFrankfurt = losAngelesToFrankfurt.map(() => ({
      number: 'AB-3000',
      departureUTC: new Date(date.setUTCHours(date.getUTCHours() + 24)),
      durationMins: 710,
      get arrivalUTC() {
        return new Date(new Date(this.departureUTC)
          .setUTCMinutes(this.departureUTC.getUTCMinutes() + this.durationMins));
      },
      aircraft: this.aircrafts[2],
      originAirport: this.airports[5],
      destinationAirport: this.airports[4],
      economyFare: 350,
      businessFare: 600,
    }));

    this.flights = [londonToParis, dubaiToBeijing, frankfurtToLosAngeles,
      parisToLondon, beijingToDubai, losAngelesToFrankfurt]
      .reduce((flattened, element) => flattened.concat(element));
  }

  seedFlights() {
    return new Promise((resolve, reject) => {
      this.db.collection('flights').insert(this.flights, ((err, result) => {
        if (err) reject(err);
        resolve(result);
      }));
    });
  }
}
