// Import Mongoose package
const mongoose = require('mongoose');

// Define the Person Schema matching prototype requirements:
// - name: String [required]
// - age: Number
// - favoriteFoods: Array of Strings [String]
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  age: {
    type: Number,
    default: 0
  },
  favoriteFoods: {
    type: [String],
    default: []
  }
});

// Export the Person Model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
