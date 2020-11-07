const localStrategy = require('passport-local').Strategy;
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

module.exports = function (passport) {
    passport.use(new localStrategy({usernameField : 'email'}, (email, password, done) => {
        // user match
            User.findOne({ email : email })
                .then((user) => {
                    if(!user){
                        return done(null, false, {message : 'The email is not registered'})
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(isMatch){
                            return done(null, user)
                        }
                        else{
                            return done(null, false, {message : 'Incorrect password'})
                        }
                    })
                })
                .catch(err => console.log(err))
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
    })
}