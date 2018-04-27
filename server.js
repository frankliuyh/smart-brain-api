const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'ubuntu',
    password : 'password',
    database : 'smart-brain'
  }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    knex.select('email', 'hash').from('login').where('email', '=', email).then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            return knex.select('*').from('users').where('email', '=', email).then(user => {
                res.json(user[0]);
            }).catch(err => res.status(400).json('unable to get user'));
        } else {
            res.status(400).json('wrong credentials');
        }
    }).catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        }).into('login').returning('email').then(loginEmail => {
            return trx('users').returning('*').insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            });
        }).then(trx.commit).catch(trx.rollback);
    }).catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    knex.select('*').from('users').where({id}).then(user => {
        if(user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('no such user');
        }
    }).catch(err => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
    const id = req.body.id;
    knex('users').where('id', '=', id).increment('entries', 1).returning('entries')
    .then(entries => res.json(entries[0])).catch(err => res.status(400).json('unable to get entries'));
});

app.listen(8081, () => {
    console.log("app is running on port 8081");
});