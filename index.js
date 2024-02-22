const mongoose = require('mongoose');
const fs = require('fs');

// Define the MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/restro';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for the Restaurant model
const restaurantSchema = new mongoose.Schema({
  restaurant_id: Number,
  name: String,
  borough: String,
  cuisine: String,
  grades: [
    {
      date: Date,
      grade: String,
      score: Number
    }
  ],
  address: {
    street: String,
    zipcode: String,
    coord: [Number]
  }
});

// Define the Restaurant model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

(async () => {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync('restaurants.json', 'utf-8');
    const restaurants = JSON.parse(jsonData);

    // Insert data into MongoDB
    await Restaurant.insertMany(restaurants);

    // MongoDB queries

    // 1. Display all the documents in the collection restaurants
    const allRestaurants = await Restaurant.find({});
    console.log("All Restaurants:", allRestaurants);

    // 2. Display the fields restaurant_id, name, borough, and cuisine for all documents
    const restaurantsWithFields = await Restaurant.find({}, { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 });
    console.log("Restaurants with specified fields:", restaurantsWithFields);

    // 3. Display the fields restaurant_id, name, borough, and cuisine, excluding the _id field
    const restaurantsExcludingId = await Restaurant.find({}, { _id: 0, restaurant_id: 1, name: 1, borough: 1, cuisine: 1 });
    console.log("Restaurants excluding _id:", restaurantsExcludingId);

    // 4. Display all the restaurants in the borough Bronx
    const bronxRestaurants = await Restaurant.find({ borough: 'Bronx' });
    console.log("Bronx Restaurants:", bronxRestaurants);

    // 5. Display the first 5 restaurants in the borough Bronx
    const firstFiveBronxRestaurants = await Restaurant.find({ borough: 'Bronx' }).limit(5);
    console.log("First five Bronx Restaurants:", firstFiveBronxRestaurants);

    // 6. Display the next 5 restaurants after skipping the first 5 in the borough Bronx
    const nextFiveBronxRestaurants = await Restaurant.find({ borough: 'Bronx' }).skip(5).limit(5);
    console.log("Next five Bronx Restaurants:", nextFiveBronxRestaurants);

    // 7. Find the restaurants that achieved a score more than 90
    const highScoreRestaurants = await Restaurant.find({ "grades.score": { $gt: 90 } });
    console.log("Restaurants with score more than 90:", highScoreRestaurants);

    // Close MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    // Close MongoDB connection in case of error
    mongoose.connection.close();
  }
})();
