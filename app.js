const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const app = express()

// passport config
require('./config/passport')(passport)

const db = require('./config/keys').userURI
mongoose.connect(db, {useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => {
        console.log('mongoDB connected...')
    })
    .catch((err) => {
        console.log(err)
    })

// ejs template engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

// body parser
app.use(express.urlencoded ({extended : false}))

// express session
app.use(session({
    secret: 'secrete',
    resave: true,
    saveUninitialized: true
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

// flash 
app.use(flash())

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})  

// connecting routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
})