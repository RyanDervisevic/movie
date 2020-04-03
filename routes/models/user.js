const mongoose = require('mongoose');
  const Schema = mongoose.Schema

  const userSchema = Schema({
    login : {type: String},
    mdp : {type: String},
    admin : {type: Boolean},
    nom : {type: String},
    prenom : {type: String}
  })

  const User = mongoose.model('User', userSchema);

  module.exports = User;