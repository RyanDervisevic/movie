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
api.get('/home/:login', (req,res)=>{
  const leLogin = req.params.login;
  User.findOne({login : leLogin}, (err,user) => {
    if(err) console.error(err)
    res.render('home', {user:user});
  });
});
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
api.get('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.render('movie', {movie : movie});
    });
});
api.get('/addMovie/:imdbID', (req,res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.render('addMovie', {movie : movie});
  });
});
api.post('/addMovie', (req,res) => {
  const newMovie = new Movie(req.body)
  newMovie.save((err, movie) => {
    if(err) console.error(err)
    res.render('movie', {movie:movie});
  });
});
api.post('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.json(movie);
    });
});
api.get('/all', (req,res)=> {
    Movie.find({}, (err,movies) => {
    if(err) console.error(err)
    res.render('movies',{movies: movies});
  })
})

api.get('/editMovie/:imdbID', (req,res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
  const id = req.params.imdbID;

  Movie.findOne({imdbID : id}, (err, movie) => {
  if(err) console.error(err)
  console.log(movie.imdbID +"="+movie.imdbID);
  res.render('editMovie', {movie : movie});
  });
  });
});

api.post('/editMovie/:imdbID', (req,res) => {
  const id = req.params.imdbID;
  Movie.findOne({imdbID : id}, (err, movie) => {
   if(err) console.error(err)
   Object.assign(movie, req.body).save((err, movie) => {
     if(err) console.error(err)
     res.render('movie', {movie,movie});
   })
 })
})
api.get('/remove/:imdbID', (req,res)=> {
  const id = req.params.imdbID;
  Movie.findOneAndDelete({imdbID : id}, (err, movie) => {
    if(err) console.error(err)
    res.render('movie', {movie:movie});
  })
})

module.exports = api;