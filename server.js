//jshint esversion:6

const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static('public')); //validating css
app.use(express.json());

const connectDB = require('./config/db');

connectDB();

//template Engine
app.set('views', path.join(__dirname, '/views')); // __dirname wil give us the folder name where we are writing the code
app.set('view engine', 'ejs');

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, function () {
  console.log(`Listening on port number ${PORT}`);
});
