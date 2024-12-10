# Airline Passenger Sentiment Analysis Backend

This Node.js app is designed for database operations using MongoDB. It includes features such as database migrations, validation, and uses Express for handling HTTP requests.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/apdalvi/db-be-basic.git
   cd db-be-basic
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of your project and add the necessary variables, such as:

   ```bash
   PORT=your_preferred_port_number
   MONGO_REVIEWS_DB=your_mongo_connection_string
   ```

   ```bash
   # Example
   PORT=9069
   MONGO_REVIEWS_DB=mongodb://localhost:27017/reviews
   ```

4. Run the app:

   ```bash
   npm run migrate
   npm start
   ```

   The app will be accessible at [http://localhost:9069](http://localhost:9069/).

## Scripts

- `create-migration`: Create a new database migration.
- `migration-status`: Check the status of database migrations.
- `migrate`: Run pending database migrations.
- `rollback`: Rollback the last database migration.
- `rollback-all`: Rollback all database migrations.
- `dev`: Run the app in development mode using nodemon.
- `start`: Run the app in production mode.

## Folder Structure

```
db-be-basic/
├── src/
│ ├── index.js
│ ├── routes/               - Api End Points for reviews
│ ├── handler/              - Backend and db connection
│ ├── queries/              - Main mongodb queries
│ ├── models/               - Review Schema modal
│ ├── services/             - Sentiment analysis model and logical
│ └── ...
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Features

List the key features of your React app.

- Local Caching
- Concurrent Queries
