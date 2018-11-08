const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log("Unable to append to the file. This error occured");
      console.log(err);
    }
  });
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
// res.render('maintainance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{
  return text.toUpperCase();
});

hbs.registerHelper('getwinners', (text) =>{
  var returner = fs.readFileSync('./leaders.txt', 'utf8');
  var arr = returner.split("\n");
  arr = arr.map((line) => { return "<li>" + line + "</li>" });
  console.log(arr.toString().replace(/,/g,""));
  return arr.toString().replace(/,/g,"");
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the End of the Maze.',
  });
  var {RollNo, Name, Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9} = req.query;
  var score = 0;
  if (RollNo && Name) {
    if (Q1 && Q1 === "liefootsteps") {
      score++;
    }
    if (Q2 && Q2 === "thursday") {
      score++;
    }
    if (Q3 && Q3 === "death") {
      score++;
    }
    if (Q4 && Q4 === "silence") {
      score++;
    }
    if (Q5 && Q5 === "darkness") {
      score++;
    }
    if (Q6 && Q6 === "tomorrow") {
      score++;
    }
    if (Q7 && Q7 === "echo") {
      score++;
    }
    if (Q8 && Q8 === "earth") {
      score++;
    }
    if (Q9 && Q9 === "inkstand") {
      score++;
    }
    // fs.appendFile("./leader.txt", `${RollNo} ${Name} ${Q1}\n`);
    fs.appendFile("./leaders.txt", `${new Date().toLocaleTimeString()} ${RollNo} ${Name} ${score}\n`);
  }
});

app.get('/node_android_ml', (req, res) => {
  fs.writeFile('./leaders.txt', "", (err) => {
    if (err) throw err;
    console.log("File cleaned!");
  })
  res.send('File cleaned!');
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
      errorMessage: "unable to handle message."
  });
});

app.get('/leaderboards', (req, res) => {
  res.render('leaderboards.hbs', {
    pageTitle: 'Leader Boards',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
