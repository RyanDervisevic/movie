const mongoose = require('mongoose');
  const Schema = mongoose.Schema

  const movieSchema = Schema({
    imdbID : {type: String},
    title : {type: String},
    genres : {type: String},
    imdbRating : {type: String},
    poster : {type: String},
    summary : {type: String},
    directors : {type: String},
    trailer: {type: String}
  })

  const Movie = mongoose.model('Movie', movieSchema);

  module.exports = Movie;