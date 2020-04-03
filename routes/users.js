const express = require('express');
const User = require('./models/user')
const api = express.Router()
var request = require("request");

var lesUsersURL = "http://localhost:4500/api/v1/all";
var lesUsers;
api.get('/all', (req,res)=> {
    User.find({}, (err,users) => {
    if(err) console.error(err)
		lesUsers = res.json(users);
		console.log(lesUsers['login']);
  })
})
lesUsersURL = 'http://localhost:4500/api/v1/home/5e8305940ecfff431499bd03'

api.get('/add', (req,res) => {
  res.render('_form')
})
api.post('/add', (req,res) => {
  const newUser = new User(req.body)
  newUser.save((err, user) => {
    if(err) console.error(err)
    res.json(user);
  })
})
api.get('/login', (req, res) => {
	User.findOne({ login: req.params.login,
			mdp: req.params.mdp }, (err, user) => {
					console.log(user)
			})
})
api.get('/connexion', (req,res)=> {
	User.findOne(req.params.login, (err, foodtruck) =>{
		if(err) console.error(err)
		res.render('connexion');
	})
})
api.post('/connexion', (req,res)=> {
	const login=req.body.login;
	const mdp = req.body.mdp
	User.findOne({login:login, mdp: mdp}, (err, user) =>{
		if (user){
			res.redirect('home')
		}
		else{
			console.log('invalid credential')
		}
	})
})
// request({
// 	url: lesUsersURL,
// 	json: true
// }, 
// function (error, response, body) {
// 	if (!error && response.statusCode === 200) {
// 		console.log(body.login);
// 	}
// })

api.get('/edit/:id', (req,res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) console.error(err)
    res.render('_formEdit', {user: user})
  })
})
api.post('/edit/:id', (req,res)=> {
  const id = req.params.id;
  User.findById(id, (err, user) => {
   if(err) console.error(err)
   Object.assign(user, req.body).save((err, user) => {
     if(err) console.error(err)
     res.redirect('/api/v1/all')
   })
 })
})

api.get('/remove/:id', (req,res)=> {
    User.findByIdAndDelete(req.params.id, (err, user) => {
    if(err) console.error(err)
    res.redirect('/api/v1/all')
  })
})
module.exports = api;