const express = require('express')
const User = require('../models/User')

const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

// login page
router.get('/login', (req, res) => {
    res.render('login')
})

// register page
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    var errors = []

    if(!name || !email || !password || !password2){
        errors.push({msg : 'Please fill all the fields'})
    }
    if(password != password2){  
        errors.push({msg : 'Password must match'})
    }
    if(password.length < 6){
        errors.push({msg : 'Password length must be greater than or equal to 6'})
    }

    if(errors.length > 0){
       res.render('register', {
           errors,
           name,
           email,
           password,
           password2
       })
    }
    else{
        User.findOne({ email : email})
            .then((user) => {
                if(user){
                    errors.push({ msg : 'Email already exists'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if(err) throw err

                            newUser.password = hash
                            newUser.save()
                            .then(() => {
                                req.flash('success_msg', 'You are registered and can now log in')
                                res.redirect('/users/login')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        })
                    })
                }
            })
    }
})


// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next)
})

// logout handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router