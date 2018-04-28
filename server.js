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

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    knex('users').select('*').then(users => {res.json(users)});
});

app.post('/signin', (req,res) => {signin(req, res, knex, bcrypt)});

app.post('/register', (req,res) => {register(req, res, knex, bcrypt)});

app.get('/profile/:id', (req,res) => {profile(req, res, knex)});

app.put('/image', (req,res) => {image.handleImage(req, res, knex)});

app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)});

app.listen(8081, () => {
    console.log("app is running on port 8081");
});