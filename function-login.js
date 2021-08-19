const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient;

const uri = "your_uri";

MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('db_zuummapp');

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    });
})

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/users', (req, res) => {
    if (req.query.username != null || req.query.password != null) {
        db.collection('users').find({
            'username': req.query.username,
            'password': req.query.password
        }).toArray((err, results) => {
            if (err) return console.log(err)
            res.send({ data: results });
        });
    } else db.collection('users').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.send({ data: results });
    });
});

app.post('/users', (req, res) => {
    try {
        if (req.query.username != null || req.query.password != null) {
            db.collection('users').insertOne({ "username": req.query.username, "password": req.query.password, "active": true })
            res.send({ 'status': 200, 'message': 'incluído com sucesso' })
        } else
            res.send({
                'status': 500, 'message': 'Ocorreu um erro ao incluir',
                'parameters': [
                    { 'username': req.query.username },
                    { 'password': req.query.password },
                    { 'active': true }
                ]
            });
    } catch (e) {
        res.send({ 'status': 500, 'message': e });
    }
});

app.delete('/users', (req, res) => {
    try {
        if (req.query.id != null)
            db.collection('users').deleteOne({ "_id": req.query.id });
    } catch (e) {
        res.send({ 'status': 500, 'message': e });
    }
});
