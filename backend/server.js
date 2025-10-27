import express from 'express';
import session from 'express-session'
import path from 'path';
import ejs from 'ejs'
import dotenv from 'dotenv';
import cors from 'cors'

// Routes
import userRouter from './routes/userRouter.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;
const app = express();

// middlewear

// Sessions
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10000}
}))


app.use(cors());
// Om man vill använda servern för API anrop

// Se till att servern skall kunna hantera POST body i json.
app.use(express.json());

app.use(userRouter)


// Använd möjligheten till template - template engine
// EJS
app.set('view engine', 'ejs')

const obj = {
  title: "Star Wars",
  author: "Mattias Lager",
  characters: [
    "Luke Skywalker",
    "Darth Vader",
    "Chewbacca",
    "Han Solo",
    "Leia Organa",
    "Yoda",
    "Palpatine"
  ]
}

app.get('/', (req, res) => {
  // en template engine som ejs förutsätter att filer läggs i mappen views

  obj.title = "Star Wars - Home"
  obj.user = req.session.user ? req.session.user : "",
  obj.characters = [
    "Luke Skywalker",
    "Darth Vader",
    "Chewbacca",
    "Han Solo",
    "Leia Organa",
    "Yoda",
    "Palpatine"
  ]
  res.render('index', obj)
})

app.get('/ships', (req, res) => {
  // en template engine som ejs förutsätter att filer läggs i mappen views
  obj.title = "Star ships",
  obj.user = req.session.user ? req.session.user : "",
  obj.characters = [
    "Millennium Falcon",
    "X-Wing",
    "TIE Fighter",
    "Star Destroyer",
    "Death Star"
  ]
  res.render('index', obj)
})

app.get('/login', (req, res) => {
  // en template engine som ejs förutsätter att filer läggs i mappen views

  // Finns det något sessions id kopplat till sessionen
  // console.log("session id: ", req.sessionID)
  
  // Kolla vad som finns i query string
  // console.log(req.query)

  // I express-session kan man lägga till key-value, ex user
  if (req.query.user) {
    req.session.user = req.query.user
  }

  console.log(req.session)
  
  obj.user = req.session.user ? req.session.user : "",
  obj.title = "Login",
  obj.characters = [
    "Luke Skywalker",
    "Darth Vader",
    "Chewbacca",
    "Han Solo",
    "Leia Organa",
    "Yoda",
    "Palpatine"
  ]

  res.render('login', obj)
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')

  })


app.use(express.static(path.resolve('public')))

// Lägg till att visa en sidan om en fil inte kan hittas.
// dvs 404
app.use((req, res) => {
  res.status(404).sendFile(path.resolve('public/404.html'))
})


app.listen(PORT, (error) => {
  
  if (error) {
    console.error("error: ", error)
    console.log(`Server not listening... check port: ${PORT}`)
    return;
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});


