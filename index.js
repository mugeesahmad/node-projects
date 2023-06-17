// Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

console.clear();

// Connecting to database

const con = "mongodb://127.0.0.1:27017/pharmacy";
mongoose.connect(con).then( ()=>{console.log('connected')});

// Init app

const app = express();

const inventory = require('./routes/inventory');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/inventory/', inventory);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('server started on port 3000');
});
