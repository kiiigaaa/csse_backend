const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const User = require('../models/user'); // Adjust the path as needed to correctly import the User model


const fs = require('fs');


// Create a new trip
router.post('/trips', async (req, res) => {
  const { startPoint, endPoint, ticketFee } = req.body;
  try {
    const trip = new Trip({ startPoint, endPoint, ticketFee });
    const savedTrip = await trip.save();
    res.json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create the trip' });
  }
  // Inside the POST /trips route
const trip = new Trip({ startPoint, endPoint, ticketFee });
const savedTrip = await trip.save();

// Generate a QR code based on trip data
const qrData = JSON.stringify({
  startPoint: savedTrip.startPoint,
  endPoint: savedTrip.endPoint,
  ticketFee: savedTrip.ticketFee,
});

QRCode.toFile(`./qrcodes/${savedTrip._id}.png`, qrData, (err) => {
  if (err) {
    console.error('Failed to generate QR code');
  }
});

// Save the file path to the generated QR code in the database
savedTrip.qrCodePath = `./qrcodes/${savedTrip._id}.png`;
await savedTrip.save();
});

// Retrieve a specific trip by ID
router.get('/trips/:id', async (req, res) => {
  const tripId = req.params.id;
  try {
    const trip = await Trip.findById(tripId);
    res.json(trip);
  } catch (error) {
    res.status(404).json({ error: 'Trip not found' });
  }
});

// List all trips
router.get('/trips', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Define a route for searching ticket fees
router.get('/search-ticket-fee', async (req, res) => {
  const { startPoint, endPoint } = req.query;

  // Search the database for the ticket fee based on start and end points
  const trip = await Trip.findOne({ startPoint, endPoint });

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  // Return the ticket fee
  res.json({ ticketFee: trip.ticketFee });
});

// API route to fetch start points
// API route to fetch start points
router.get('/start-points', async (req, res) => {
  try {
    const startPoints = await Trip.distinct('startPoint').exec();
    res.json(startPoints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch start points' });
  }
});

// API route to fetch end points
router.get('/end-points', async (req, res) => {
  try {
    const endPoints = await Trip.distinct('endPoint').exec();
    res.json(endPoints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch end points' });
  }
});

router.get('/user/credits/:userId', (req, res) => {
  const userId = req.params.userId;

  // Find the user by ID and retrieve their credits
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ credits: user.credits });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch user credits', details: error });
    });
});

// Add this route to your backend
router.put('/user/credits/:userId', (req, res) => {
  const userId = req.params.userId;
  const { credits } = req.body; // Credits to be updated

  // Find the user by ID and update their credits
  User.findByIdAndUpdate(
    userId,
    { credits: credits },
    { new: true } // To return the updated user object
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ credits: user.credits });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update user credits', details: error });
    });
});



module.exports = router;
