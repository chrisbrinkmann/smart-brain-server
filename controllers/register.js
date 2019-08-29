// registers a new user in the DB, returns the user object
const handleRegister = (req, res, db, bcrypt, saltRounds) => {
	const { email, name, password } = req.body
	// validate req
	if (!email || !name || !password){
		return res.status(400).json('unable to register')
	}
	// put the req password thru the bcrypt hashing function
	bcrypt.hash(password, saltRounds)
	.then(hash => {
		db.transaction(trx => {
			// QUERY #1
			// insert the email, hashed password into the db login table
			trx.insert({
				hash,
				email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				// QUERY #2
				// insert the req name, email, and current date into users table
				return trx('users') // why is return needed?
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.returning('*')
				.then(user => {
					// send res containing newly created user object
					res.json(user[0])
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
	})
	.catch('error');
}

module.exports = {
	handleRegister
}