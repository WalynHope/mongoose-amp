# 🍃 Mongoose Checkpoint

A guided checkpoint project demonstrating how to handle and manage a MongoDB database using **Mongoose** ODM (Object Data Modeling) in Node.js.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Person Schema](#person-schema)
- [Operations Covered](#operations-covered)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)

---

## Overview

This project walks through the core Mongoose CRUD operations including:

- Connecting to **MongoDB Atlas**
- Defining **Schemas** and **Models**
- Creating, reading, updating, and deleting documents
- Chaining query helpers for refined search results

---

## Project Structure

```
mongoose-checkpoint/
├── myApp.js          # Main application — all Mongoose logic lives here
├── package.json      # Project metadata and dependencies
├── package-lock.json # Locked dependency versions
├── models/
│   └── Person.js     # Person schema and model (alternative split)
├── .gitignore        # Excludes node_modules/ and .env from git
└── .env              # 🔒 Private — NOT committed (add your own)
```

---

## Person Schema

```js
{
  name:          { type: String,   required: true         },
  age:           { type: Number,   min: 0                 },
  favoriteFoods: { type: [String], default: []            },
}
```

MongoDB auto-generates a unique `_id` (ObjectId) for every document.

---

## Operations Covered

| # | Operation | Mongoose Method |
|---|-----------|----------------|
| 1 | Connect to database | `mongoose.connect()` |
| 2 | Define schema & model | `new mongoose.Schema()` / `mongoose.model()` |
| 3 | Save one record | `new Person({...}).save(callback)` |
| 4 | Save many records | `Person.create(array, callback)` |
| 5 | Find by field | `Person.find({ name }, callback)` |
| 6 | Find one by field | `Person.findOne({ favoriteFoods: food }, callback)` |
| 7 | Find by `_id` | `Person.findById(id, callback)` |
| 8 | Find → edit → save | `.findById()` + `Array.push()` + `.save()` |
| 9 | Atomic update | `Person.findOneAndUpdate(..., { new: true }, callback)` |
| 10 | Delete one by `_id` | `Person.findByIdAndRemove(id, callback)` |
| 11 | Delete many by field | `Person.remove({ name: "Mary" }, callback)` |
| 12 | Chained query helpers | `.find().sort().limit().select().exec(callback)` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/WalynHope/mongoose-amp.git
   cd mongoose-amp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create your `.env` file** (see below)

---

## Environment Variables

Create a `.env` file in the project root. This file is **private** and must never be committed to git.

```
MONGO_URI='mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0'
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

---

## Running the App

```bash
node myApp.js
```

You should see output like:

```
✅ Successfully connected to MongoDB Atlas!

🚀 Running all Mongoose operations...

--- createAndSavePerson ---
✅ Result: { "_id": "...", "name": "Alice", "age": 28, ... }

--- createManyPeople ---
✅ Result: [...]
...
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| [`mongoose`](https://mongoosejs.com/) | MongoDB ODM — schema, validation, queries |
| [`dotenv`](https://www.npmjs.com/package/dotenv) | Load environment variables from `.env` |

---

## ⚠️ Security Note

- The `.env` file containing your `MONGO_URI` is listed in `.gitignore` and will **never** be pushed to GitHub.
- Never hardcode database credentials directly in source files.
