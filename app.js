const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const app = express();

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://kishen:12345@customermanage.utv508z.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport JWT configuration
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    // Implement your logic to validate the user here
    // For simplicity, let's assume a user exists in a Users collection in MongoDB
    // You can implement this logic in a separate file
    User.findById(jwt_payload.id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// Routes: Implement your registration and login routes here
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/tripRoutes');
app.use('/auth', authRoutes);
app.use('/trip',tripRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
