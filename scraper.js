const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request');
const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';
var Movie = require('./routes/models/movie');

const searchCache = {};
const movieCache = {};

function searchMovies(searchTerm) {
  if(searchCache[searchTerm]) {
    console.log('Serving from cache:', searchTerm);
    return Promise.resolve(searchCache[searchTerm]);
  }

  return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function(i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');
        const imdbID = $title.attr('href').match(/title\/(.*)\//)[1];
        const poster = $element.find('.primary_photo a img').attr('src');
        // const imdbRating = getMovie(imdbID).then((movie) => {
        //   const imdbRating = movie.imdbRating
        // })
       
        const movie = {
          image: $image.attr('src'),
          title: $title.text(),
          imdbID,
          poster
        };
        movies.push(movie);
      });

      searchCache[searchTerm] = movies;

      return movies;
    });
}

function getMovie(imdbID) {
  if(movieCache[imdbID]) {
    console.log('Serving from cache:', imdbID);
    return Promise.resolve(movieCache[imdbID]);
  }

  return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      const $title = $('.title_wrapper h1');
      const title = $title.first().contents().filter(function() {
        return this.type === 'text';
      }).text().trim();
      const genres = [];
      $('div.subtext a').each(function(i, element) {
        const genre = $(element).text();
        genres.push(genre);
      });
      const imdbRating = $('span[itemProp="ratingValue"]').text();
      const poster = $('div.poster a img').attr('src');
      const summary = $('div.summary_text').text().trim();
      function getItems(itemArray) {
        return function(i, element) {
          const item = $(element).text().trim();
          itemArray.push(item);
        };
      }
      const directors = [];
      
			$('div.credit_summary_item a').each(getItems(directors));

      const trailer = $('a[itemProp="trailer"]').attr('href');

      const movie = {
        imdbID,
        title,
        genres,
        imdbRating,
        poster,
        summary,
        directors,
        trailer: `https://www.imdb.com${trailer}`
      };
      movieCache[imdbID] = movie;

      return movie;
    });
}

module.exports = {
  searchMovies,
  getMovie
};