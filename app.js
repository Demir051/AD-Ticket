const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const formatDateMiddleware = require('./middlewares/formatDate');
const fullFormatDateMiddleware = require('./middlewares/formatFullDate');
const isAdmin = require('./middlewares/isAdmin');
const checkAuthCookie = require('./middlewares/checkAuthCookie');

const app = express();
dotenv.config();

const Admin = require('./models/admin');
const Ticket = require('./models/ticket');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json()); // Use body-parser for JSON parsing
app.use(bodyParser.urlencoded({
  extended: false
})); // Use body-parser for URL-encoded data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Separate route handling
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use(authRouter);
app.use('/adminpanel', adminRouter);

app.use(formatDateMiddleware);
app.use(fullFormatDateMiddleware);
app.use(isAdmin);
app.use(checkAuthCookie);

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
// app.use(function (err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);

//   // Send structured JSON response for API requests
//   if (req.originalUrl.startsWith('/api/')) {
//     res.json({
//       error: err.message
//     });
//     return;
//   }

//   // Render error page for non-API requests
//   res.render('error');
// });

module.exports = app;
