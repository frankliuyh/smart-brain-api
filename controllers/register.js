const register = (req, res, knex, bcrypt) => {
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
};

module.exports = register;