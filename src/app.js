import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import api from './routes/api';
import Database from './db';
import config from './config/main.json';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Database(config.database);

db.connect()
  .then(() => {
    if (config.database.seeding.reseed) db.drop();
    db.assembleAircrafts();
    db.generateFlights();
    db.seedFlights();
  })
  .then(() => {
    app.use('/', express.static('public'));
    app.use('/api/', api({ db }));
    app.server.listen(process.env.PORT || config.server.port);
    console.log(`Server listening on port ${app.server.address().port}...`);
  })
  .catch((err) => {
    throw err;
  });
