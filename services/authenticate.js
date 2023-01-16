const jwt = require('jsonwebtoken');
const user = require('../db/users');
const bcrypt = require('bcrypt');

//User login
const login = (req, res) => {
    //Extract email and password from request body
    const email = req.body.email;
    const password = req.body.password;
    //Check if user exists in the database
    const loginUser = user.getUserByEmail(email, (user) => {
        if (user.length > 0) {
            const hashpwd = user[0].password;
            //Create json web token
            const token = jwt.sign({ userId: email }, process.env.SECRET_KEY);
            //If password match, send the token
            if (bcrypt.compareSync(password, hashpwd))
                res.send({ token })
            else
                res.sendStatus(400).end();
        }
        else {
            res.sendStatus(400).end()


        }
    })
}

//User authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(400).end();
    }

    //Verify the received token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err)
            res.sendStatus(400).end();
        else
            next();
    })
}

module.exports = {
    authenticate: authenticate,
    login: login
}