const Clarifai = require('clarifai')

// object for calling face detection API
const app = new Clarifai.App({
	apiKey: process.env.C_API_KEY // insert your Clarifai API key here in place of process.env.C_API_KEY
})

// send req to clarafai face detect api
const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data)
	})
	.catch(err => false) // how to return false + addt'l data?
}

// increment the user's entries prop, returns user's entry count
const handleEntry = (req, res, db) => {
	const { id } = req.body
	db('users')
	.where({id})
	.increment({entries:1})
	.returning('entries')
	.then(entries => {
		res.json(entries[0])
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleEntry,
	handleApiCall
}