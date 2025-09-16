FULLSTACK SQL PROJECT SETUP

1. BACKEND SETUP (Node.js + Express)

cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mysql2 dotenv cors helmet morgan

# Install nodemon for auto-restart in development
npm install --save-dev nodemon

# In package.json, add this under "scripts":
# "dev": "nodemon index.js"

# Sample start command (once index.js is ready)
npm run dev


2. FRONTEND SETUP (React)

cd ../frontend

# If not created yet:
npx create-react-app .

# Start frontend
npm start

3. SQL SETUP (MySQL)

# Go to SQL scripts folder
cd ../sql

# Login to MySQL
mysql -u root -p

# Inside MySQL prompt
source schema.sql;

# Test your tables
SELECT * FROM salesman;
SELECT * FROM customer;
SELECT * FROM orders;

4. ENVIRONMENT SETUP (.env file)

# Create a `.env` file in /backend with the following content:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=sco

5. BACKEND FILES OVERVIEW

# db.js (MySQL connection)
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = pool.promise();

# index.js (Backend API)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/salesman', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM salesman');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});

6. FRONTEND FETCH EXAMPLE

# Use this in a React component (e.g., useEffect)

useEffect(() => {
  fetch('http://localhost:3001/api/salesman')
    .then(res => res.json())
    .then(data => console.log(data));
}, []);

7. OPTIONAL: GIT + GITHUB SETUP

# Initialize Git
git init

# Add remote repository (only once)
git remote add origin https://github.com/kves-Shahid/SQL.git

# Add all files and commit
git add .
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main


8. VS CODE SQLTools USAGE

# Open SQLTools sidebar (left bar)
# Right-click → "New Connection"
# Fill in:
#   Name: Local MySQL
#   Server: localhost
#   Port: 3306
#   User: root
#   Password: ********
#   Default DB: sco
#   Save as plaintext or prompt

# Attach SQL file:
# Right-click in schema.sql → "Attach Connection to This File"

# Run Queries:
# Highlight query → Ctrl+E Ctrl+E

Now you can run:
- SQL in SQLTools or terminal
- Backend via `npm run dev`
- Frontend via `npm start`

Waka time management---https://wakatime.com/@8bfb26b9-68d1-4472-aa67-061141229311/projects/cupdgzomyx