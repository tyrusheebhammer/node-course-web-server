const express = require('express'); //#1
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express(); //#2

var maintenance = false;
//Middleware to tweak the way express works
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');


app.use((req, res, next) => {
    var now = new Date().toString();    
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err)=> {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
}); //register middleware


if (maintenance){  
    app.use((req, res, next) => {
        res.render('maintenance.hbs');       
    });
}

app.use(express.static(__dirname + '/public')); //#3

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => { // '/' is the root route
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!',
        name: 'Tyrus',
        likes: ["dogs",
                " cats",
                " kayla"]
    });
}); 

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Bad Request'
    });
});

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
}); //developing locally .. #4

//this allows you to serve up a directory in 4 lines above