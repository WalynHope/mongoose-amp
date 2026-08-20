/**
 * ============================================================
 * myApp.js - Mongoose Checkpoint
 * ============================================================
 * This file demonstrates the core CRUD operations using
 * Mongoose and MongoDB Atlas. It covers:
 *  - Schema & Model creation
 *  - Creating single and multiple records
 *  - Finding records (by field, by ID)
 *  - Updating records (find-edit-save and findOneAndUpdate)
 *  - Deleting records (single and many)
 *  - Chaining query helpers
 * ============================================================
 */

'use strict';

// Load environment variables from the .env file BEFORE anything else
require('dotenv').config();

// Import Mongoose ODM library
const mongoose = require('mongoose');

// ============================================================
// 1. Connect to the MongoDB Atlas database
// ============================================================
// We retrieve the URI from the .env file via process.env.
// useNewUrlParser and useUnifiedTopology are passed to avoid
// deprecation warnings from older Mongoose driver versions.
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Listen for a successful connection event and log confirmation
mongoose.connection.on('connected', () => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
});

// Listen for connection errors and log the error message
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ============================================================
// 2. Define the Person Schema
// ============================================================
// A Schema maps to a MongoDB collection and defines the shape
// of the documents within that collection.
const personSchema = new mongoose.Schema({
  // name is required — Mongoose will throw a validation error
  // if a Person is saved without a name.
  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  // age is an optional Number field with a minimum value guard
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
  },

  // favoriteFoods stores an array of strings (e.g. ["pizza", "sushi"])
  favoriteFoods: {
    type: [String],
    default: [], // Default to an empty array if not provided
  },
});

// ============================================================
// 3. Compile the Schema into a Model
// ============================================================
// A Model is a class with which we construct documents.
// Mongoose automatically pluralises "Person" → "people" collection.
const Person = mongoose.model('Person', personSchema);

// ============================================================
// Helper: done() callback
// ============================================================
// In the context of these exercises, done() simulates the
// callback pattern used by the test suite (err, data).
const done = (err, data) => {
  if (err) {
    console.error('❌ Error:', err.message);
  } else {
    console.log('✅ Result:', JSON.stringify(data, null, 2));
  }
};

// ============================================================
// 4. Create and Save a Single Record
// ============================================================
/**
 * createAndSavePerson
 * -------------------
 * Instantiates a new Person document using the Person constructor,
 * then persists it to the database with .save().
 * The Node-convention callback (err, data) is passed to .save().
 */
const createAndSavePerson = () => {
  // Instantiate a Person document with required fields
  const person = new Person({
    name: 'Alice',
    age: 28,
    favoriteFoods: ['pizza', 'sushi'],
  });

  // Save the document to the DB; Mongoose calls our callback with
  // (err, savedDocument) once the operation completes.
  person.save(function (err, data) {
    if (err) return done(err);
    console.log('\n--- createAndSavePerson ---');
    done(null, data);
  });
};

// ============================================================
// 5. Create Many Records with Model.create()
// ============================================================
/**
 * createManyPeople
 * ----------------
 * Uses Model.create() to insert multiple Person documents at once.
 * This is more efficient than calling .save() in a loop.
 *
 * @param {Array} arrayOfPeople - Array of plain objects conforming to personSchema
 */
const createManyPeople = (arrayOfPeople) => {
  // Model.create() accepts an array and inserts all documents in one go
  Person.create(arrayOfPeople, function (err, data) {
    if (err) return done(err);
    console.log('\n--- createManyPeople ---');
    done(null, data);
  });
};

// Sample data to seed the database
const peopleToCreate = [
  { name: 'Bob',    age: 35, favoriteFoods: ['burgers', 'tacos']          },
  { name: 'Mary',   age: 22, favoriteFoods: ['salad', 'burritos']         },
  { name: 'Carlos', age: 40, favoriteFoods: ['burritos', 'steak']         },
  { name: 'Diana',  age: 30, favoriteFoods: ['burritos', 'pasta', 'cake'] },
  { name: 'Mary',   age: 27, favoriteFoods: ['burritos', 'ramen']         },
];

// ============================================================
// 6. Find All Records Matching a Name
// ============================================================
/**
 * findPeopleByName
 * ----------------
 * Uses Model.find() to retrieve ALL documents that match the
 * given name. Returns an array (possibly empty) of Person docs.
 *
 * @param {string} name - The name to search for
 */
const findPeopleByName = (name) => {
  // Model.find({ field: value }) searches with an equality filter
  Person.find({ name: name }, function (err, data) {
    if (err) return done(err);
    console.log('\n--- findPeopleByName ---');
    done(null, data);
  });
};

// ============================================================
// 7. Find One Record by Favorite Food
// ============================================================
/**
 * findOneByFood
 * -------------
 * Uses Model.findOne() to retrieve the FIRST document whose
 * favoriteFoods array contains the specified food string.
 *
 * @param {string} food - The food item to search for
 */
const findOneByFood = (food) => {
  // favoriteFoods is an array; MongoDB's equality operator
  // automatically checks if the value exists in the array.
  Person.findOne({ favoriteFoods: food }, function (err, data) {
    if (err) return done(err);
    console.log('\n--- findOneByFood ---');
    done(null, data);
  });
};

// ============================================================
// 8. Find a Record by _id
// ============================================================
/**
 * findPersonById
 * --------------
 * Uses Model.findById() to locate exactly one document by its
 * unique MongoDB ObjectId (_id). Each document has a unique _id
 * assigned automatically by MongoDB.
 *
 * @param {string} personId - The MongoDB _id of the person
 */
const findPersonById = (personId) => {
  // findById is a shortcut for findOne({ _id: personId })
  Person.findById(personId, function (err, data) {
    if (err) return done(err);
    console.log('\n--- findPersonById ---');
    done(null, data);
  });
};

// ============================================================
// 9. Classic Update: Find → Edit → Save
// ============================================================
/**
 * findEditThenSave
 * ----------------
 * Demonstrates the traditional update pattern:
 *  1. Find the document by _id
 *  2. Mutate the document in memory (push a new food)
 *  3. Call .save() to persist the changes
 *
 * @param {string} personId - The MongoDB _id of the person to update
 */
const findEditThenSave = (personId) => {
  // Step 1: Find the person by their unique _id
  Person.findById(personId, function (err, person) {
    if (err) return done(err);

    // Step 2: Mutate the favoriteFoods array in memory
    // Array.push() adds "hamburger" to the end of the array
    person.favoriteFoods.push('hamburger');

    // Step 3: Save the updated document back to the database
    // Mongoose detects the change automatically for typed arrays ([String]);
    // if using Mixed type, call person.markModified('favoriteFoods') first.
    person.save(function (err, updatedPerson) {
      if (err) return done(err);
      console.log('\n--- findEditThenSave ---');
      done(null, updatedPerson);
    });
  });
};

// ============================================================
// 10. findOneAndUpdate — Set Age to 20 by Name
// ============================================================
/**
 * findAndUpdate
 * -------------
 * Uses Model.findOneAndUpdate() to atomically find and update
 * a document in one database round-trip (more efficient than
 * the find → edit → save pattern).
 *
 * @param {string} personName - The name of the person to update
 */
const findAndUpdate = (personName) => {
  // $set operator updates only the specified fields without
  // overwriting the entire document.
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },          // Search filter
    { $set: { age: ageToSet } },   // Update operation
    { new: true },                 // Return the UPDATED document (not original)
    function (err, updatedPerson) {
      if (err) return done(err);
      console.log('\n--- findAndUpdate ---');
      done(null, updatedPerson);
    }
  );
};

// ============================================================
// 11. Delete One Document by _id
// ============================================================
/**
 * removeById
 * ----------
 * Uses Model.findByIdAndRemove() to delete a single document
 * identified by its _id. The deleted document is passed to
 * the callback so callers know what was removed.
 *
 * @param {string} personId - The MongoDB _id of the person to delete
 */
const removeById = (personId) => {
  // findByIdAndRemove locates the document by _id and removes it atomically
  Person.findByIdAndRemove(personId, function (err, removedPerson) {
    if (err) return done(err);
    console.log('\n--- removeById ---');
    done(null, removedPerson);
  });
};

// ============================================================
// 12. Delete Many Documents by Name
// ============================================================
/**
 * removeManyPeople
 * ----------------
 * Uses Model.remove() to delete ALL documents that match the
 * query filter. Unlike findByIdAndRemove(), this does NOT
 * return the deleted documents — it returns a result object
 * with { ok, deletedCount } indicating the outcome.
 */
const removeManyPeople = () => {
  // Query filter: remove every document where name equals "Mary"
  const nameToRemove = 'Mary';

  Person.remove({ name: nameToRemove }, function (err, result) {
    if (err) return done(err);
    console.log('\n--- removeManyPeople ---');
    // result contains { ok: 1, n: <count>, deletedCount: <count> }
    done(null, result);
  });
};

// ============================================================
// 13. Chain Query Helpers to Narrow Search Results
// ============================================================
/**
 * queryChain
 * ----------
 * Demonstrates chaining multiple query helpers to build a
 * refined database query:
 *  .find()   → filter by favoriteFoods containing "burritos"
 *  .sort()   → sort results alphabetically by name (ascending)
 *  .limit()  → return at most 2 documents
 *  .select() → exclude the age field from the returned documents
 *  .exec()   → execute the query and pass result to callback
 */
const queryChain = () => {
  Person
    // Filter: only people who like burritos
    .find({ favoriteFoods: 'burritos' })

    // Sort alphabetically by name (ascending); use '-name' for descending
    .sort({ name: 1 })

    // Limit results to a maximum of 2 documents
    .limit(2)

    // Project (hide) the age field; 0 = exclude, 1 = include
    .select({ age: 0 })

    // Execute the built query and handle the result in a callback
    .exec(function (err, data) {
      if (err) return done(err);
      console.log('\n--- queryChain ---');
      done(null, data);
    });
};

// ============================================================
// 14. Run All Operations in Sequence
// ============================================================
// We wait for the DB connection before running any operations.
// Using 'once' ensures this handler fires exactly one time.
mongoose.connection.once('open', () => {
  console.log('\n🚀 Running all Mongoose operations...\n');

  // Step 1: Create a single person
  createAndSavePerson();

  // Step 2: Seed the database with multiple people
  createManyPeople(peopleToCreate);

  // Step 3: Allow a short delay so the inserts complete before reads
  // In production code, you would use async/await or promise chaining.
  setTimeout(() => {
    // Step 4: Find all people named "Mary"
    findPeopleByName('Mary');

    // Step 5: Find the first person who likes "pizza"
    findOneByFood('pizza');

    // Step 6: Find people by burrito preference with chained helpers
    queryChain();

    // Step 7: Remove all people named "Mary"
    removeManyPeople();
  }, 1000); // 1-second delay to allow inserts to settle
});
