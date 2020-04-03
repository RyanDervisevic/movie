const express = require('express');
const app = express();
const port = process.env.PORT || 4500;
const router = require('./routes/movies')
const mongoose = require('mongoose');
const cors = require('cors');
const scraper = require('./scraper');

mongoose.connect('mongodb://localhost/movie_db', {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`[MongoDB is running]`);
})

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Scraping is Fun!'
  });
});

app.get('/search/:title', (req, res) => {
  scraper
    .searchMovies(req.params.title)
    .then(movies => {
      res.json(movies);
    });
});

app.get('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.json(movie);
    });
});

// test API IMDB

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views','./views');

app.get('/', (req, res) => {
  res.send('coucou');
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api/', router);

app.listen(port, () => {
  console.log(`[App is running on port ${port}]`);
});