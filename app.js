sconst express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');

const app = express();

const aspirantRoutes = require('./routes/aspirant')
const prepodavatelRoutes = require('./routes/prepodavatel')
const raspisanieRoutes = require('./routes/raspisanie')
const predmetRoutes = require('./routes/predmet')
const diplomnikRoutes = require('./routes/diplomnik')
const loginRoutes = require('./routes/login')
const upmRoutes = require('./routes/upm')

app.use(cookieParser());
app.use(session({secret: 'big', saveUninitialized: false, resave: false}));

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.set("view engine", "hbs");

app.get("/", function (req, res) {
    if (req.session.success) {
        res.status(200).redirect("/upm")
    } else {
        res.status(401).redirect("/login")
    }
});

app.post('/logout', (req, res) => {
    req.session.success = false;
    res.status(200).redirect("/")
})

app.use('/aspirant', aspirantRoutes)
app.use('/prepodavatel', prepodavatelRoutes)
app.use('/upm', upmRoutes)
app.use('/raspisanie', raspisanieRoutes)
app.use('/predmet', predmetRoutes)
app.use('/diplomnik', diplomnikRoutes)
app.use('/login', loginRoutes)



app.listen(80, function () {
    console.log("Сервер ожидает подключения...");
});
