const Clarifai = require("clarifai");
const app = new Clarifai.App({
 apiKey: 'ac49a62b74da4a91a3390332ca0f4686'
});

const handleApiCall = (req, res) => {
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.imageURL)
    .then(data => {
        res.json(data);
    }).catch(err => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, knex) => {
    const id = req.body.id;
    knex('users').where('id', '=', id).increment('entries', 1).returning('entries')
    .then(entries => res.json(entries[0])).catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};