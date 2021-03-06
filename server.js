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
const entry = require('./controllers/submit')

// specify your own db client, connection here
const db = knex({
	client: 'pg',
	connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

app.use(bodyParser.json()) // extracts body portion of incoming req steams to req.body
app.use(cors()) // cross origin resource sharing

// test
app.get('/', (req, res) => { res.send('its working')})

// checks req credentials; if valid return user object
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// registers a new user in the DB, returns the user object
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})

// returns the user object for an id sent as a request param
app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req, res, db)})

// submit user imageurl to API
app.post('/imgsubmit', (req, res) => {entry.handleApiCall(req, res)})

// increment user's entries if API resp
app.put('/entryinc', (req, res) => {entry.handleEntry(req, res, db)})

// start the server listening for requests on the port
app.listen(process.env.PORT || 3000, () => {
	console.log(`server is listening to port ${process.env.PORT}`)
})