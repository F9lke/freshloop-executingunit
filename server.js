const express = require('express');
const path = require('path');
const session = require('express-session');
const MethodOverride = require('method-override');
const BodyParser = require('body-parser');
const passport = require('passport');
const getPort = require('get-port');

const secretOrKey = require('./config/keys').secretOrKey;

const auth = require('./routes/api/auth');
const actions = require('./routes/api/actions');

const transmitApiPort = require('./sender/transmitApiPort');

const app = express();

// Passport Config
require('./config/passport')(passport);

// View Engine
app.set("views", __dirname + '/views');
app.engine('html', require("ejs").renderFile);
app.set('view engine', 'html');

// Body Parser Middleware
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(MethodOverride('_method'));

// Express Session Middleware 
app.use(session({
    secret: secretOrKey,
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Load Api Routes
app.use('/api/auth', auth);
app.use('/api/actions', actions);

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// Start the Service
const startServer = async () => {
    const port = await getPort({ port: 5000 });
    
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        
        transmitApiPort(port);
    });
};

startServer();
