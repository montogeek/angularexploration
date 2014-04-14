// server.js

// set up ========================
var express = require('express');
var app = express();    // create our app w/ express
var mongoose = require('mongoose');     // mongoose for mongodb

// configuration =================

mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
    app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
    app.use(express.logger('dev'));     // log every request to the console
    app.use(express.bodyParser());      // pull information from html in POST
    app.use(express.methodOverride());      // simulate DELETE and PUT
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log('App listening on port 8080');

// Modelo
var Todo = mongoose.model('Todo', {
    text: String
});

// Routes
// Api
app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
        if (err)
            res.send(err);
        res.json(todos);
    });
});

app.post('/api/todo', function(req, res) {
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo) {
        if (err)
            res.send(err);
        Todo.find(function(err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });
});

app.delete('/api/todo/:todo_id', function(req, res) {
    console.log(req.params.todo_id);
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        Todo.find(function(err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });
});

// Frontend
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});
