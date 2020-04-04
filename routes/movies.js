const express = require('express');
const Movie = require('./models/movie');
const User = require('./models/user');
const api = express.Router()
const scraper = require('../scraper');
const lesImdbID = [];
const lesMovies=[];
var lm = [];
function getLesMovies(params) {
  params.forEach(element => {
    scraper
    .getMovie(element)
    .then(movie => {
      lesMovies.push(movie);
    });
  });
}

api.get('/connexion', (req,res)=> {
  User.find({}, (err, users) => {
		if(err) console.error(err)
		res.render('connexion', {users:users});
	});
});
api.post('/connexion', (req,res)=> {
  const leLogin = req.params.login;
	User.findOne({login : leLogin}, (err, user) =>{
    if(err) console.error(err)
      res.render('home', {user:user});
	})
})
api.get('/home/', (req,res)=>{
  
    res.render('home');

});
// renvoie sur la page des réusltats d'une recherche de film 
api.get('/search/:title', (req,res)=> {
  scraper
    .searchMovies(req.params.title)
    .then(movies => {
      res.render('movies', {movies: movies});
    });
  });

api.post('/search/:title', (req,res)=> {
  lesImdbID.forEach(element => {
    scraper
    .getMovie(element)
    .then(movie => {
      //console.log(movie.imdbID);
      const newMovie = new Movie(req.body);
      newMovie.save((err, movie) => {
      if(err) console.error(err)
        res.json(movie);
      });
    });
  });
});
// Renvoie sur la page des details du film 
api.get('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.render('movie', {movie : movie});
    });
});
// Renvoie sur la page d'ajout de film en récuperant les données d'imdb
api.get('/addMovie/:imdbID', (req,res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.render('addMovie', {movie : movie});
  });
});
// Envoie les données pour ajouter un film dans la base de données 
api.post('/addMovie', (req,res) => {
  const newMovie = new Movie(req.body)
  newMovie.save((err, movie) => {
    if(err) console.error(err)
    res.render('movie', {movie:movie});
  });
});
// Renvoie sur la page pour modifier le film de la bdd 
api.get('/editMovie/:imdbID', (req,res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
  const id = movie.id;
  Movie.findOne({imdbID : id}, (err, movie) => {
    res.render('editMovie', {movie : movie});
  });
  });
  });
// Envoie les donnée à modifier du film dans la bdd
api.post('/editMovie/:imdbID', (req,res) => {
  const id = req.params.imdbID;
  Movie.findOne({imdbID : id}, (err, movie) => {
   if(err) console.error(err)
   Object.assign(movie, req.body).save((err, movie) => {
     res.render('movie', {movie,movie});
   });
 });
});
// Suprime le film de la Base de données
api.get('/remove/:imdbID', (req,res)=> {
  const id = req.params.imdbID;
  Movie.findOneAndDelete({imdbID : id}, (err, movie) => {
    if(err) console.error(err)
    res.render('movie', {movie:movie});
  });
});

module.exports = api;