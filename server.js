const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const stocks = require('./routes/api/stocks');

const db = require('./config/keys').mongoURI;

// connect to DB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Database connected.'))
    .catch(err => console.log(err));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(cors());

app.use('/api/stocks', stocks);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}.`));
