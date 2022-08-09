const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User');

const Jwt = require('jsonwebtoken');
const jwtKey = 'a-comm';

const app = express();

app.use(express.json()); //midleware access to sanding data in user
app.use(cors()); //middleware to solve cors issues

// signup api
app.post('/register', async (req, resp) => {
	let user = new User(req.body);
	let result = await user.save();
	result = result.toObject();
	delete result.password;
	Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
		if (err) {
			resp.send({ result: 'something went wrong, Please try after sometime' });
		}
		resp.send({ result, auth: token });
	});
});

// login api
app.post('/login', async (req, resp) => {
	if (req.body.password && req.body.mobile) {
		let user = await User.findOne(req.body).select('-password');
		if (user) {
			Jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
				if (err) {
					resp.send({ result: 'something went wrong, Please try after sometime' });
				}
				resp.send({ user, auth: token });
			});
		} else {
			resp.send({ result: 'No User Found' });
		}
	} else {
		resp.send({ result: 'No User Found' });
	}
});

// app.get('/username', async (req, resp) => {
// 	let Users = await User.find();
// 	if (Users.length > 0) {
// 		resp.send(Users);
// 	} else {
// 		resp.send({ result: 'No User found' });
// 	}
// });

// function verifyToken(req, resp, next) {
// 	let token = req.headers['authorization'];
// 	if (token) {
// 		token = token.split(' ')[1];
// 		Jwt.verify(token, jwtKey, (err, valid) => {
// 			if (err) {
// 				resp.status(401).send({ result: 'Please provide valid token ' });
// 			} else {
// 				next();
// 			}
// 		});
// 	} else {
// 		resp.status(403).send({ result: 'Please add token with header' });
// 	}
// }

app.listen(8001);
