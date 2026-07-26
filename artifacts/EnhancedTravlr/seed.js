const mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');

const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

Trip.deleteMany({})
  .then(() => Trip.insertMany(trips))
  .then(() => {
    console.log('Database seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });