const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10; // for password hashing
const cors = require('cors')
const knex = require('knex')
const app = express()

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const entry = require('./controllers/entry')

const db = knex({
	client: 'pg',
	connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

app.use(bodyParser.json()) // extracts body portion of incoming req steams to req.body
app.use(cors()) // cross origin resource sharing

// returns array of user objects
app.get('/', (req, res) => {
	db.select('*').from('users')
	.then(data => {
		res.json(data)
	})
})

// checks req credentials; if valid return user object
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// registers a new user in the DB, returns the user object
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})

// returns the user object for an id sent as a request param
app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req, res, db)})

// increment the user's entries prop, returns user's entry count
app.put('/entry', (req, res) => {entry.handleEntry(req, res, db)})
app.post('/entryurl', (req, res) => {entry.handleApiCall(req, res)})

// start the server listening for requests on the port
app.listen(process.env.PORT || 3000, () => {
	console.log(`server is listening to port ${process.env.PORT}`)
})