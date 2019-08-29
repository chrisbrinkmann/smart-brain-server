// returns the user object for an id sent as a request param
const handleProfileGet = (req, res, db) => {
	const { id } = req.params

	db.select('*').from('users').where({id})
	.then(user => {
			// if the db returns a user, send it back to the client
			if(user.length){
				res.json(user)
			} else {
				res.status(400).json('not found')
			}
		})
	.catch(err => res.status(400).json('error getting user'))
}

module.exports = {
	handleProfileGet
}