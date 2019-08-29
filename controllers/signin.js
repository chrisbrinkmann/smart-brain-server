// checks req credentials
// if valid return user object
const handleSignin = (req, res, db, bcrypt) => {
	const { email, password } = req.body
	// validate req
	if (!email || !password){
		return res.status(400).json('unable to sign in')
	}
	// get email, password hash from db for email in req
	db.select('email', 'hash')
	.from('login')
	.where({email})
	.then(data => {
		// compare password in req to password hash from db
		bcrypt.compare(password, data[0].hash)
		.then(match => {
			if (match) {
				// password match, return user object from db
 				return db.select('*').from('users') // why is return needed?
 				.where({email})
 				.then(user => {
 					res.json(user[0])
 				})
 				.catch(err => res.status(400).json('unable to get user'))
 				// password did not match
 			} else {
 				res.status(400).json('unable to sign in')
 			}
 		})
	})
	.catch(err => res.status(400).json('invalid credentials'))
}

module.exports = {
	handleSignin
}