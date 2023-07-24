// app.js

const express = require('express');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const app = express();
app.use(express.json());

const secretKey = 'your_secret_key'; // Replace with your own secret key for JWT

// Placeholder user and session data (replace with a proper database in real application)
const users = [
  { universityID: 'A12345678', password: 'student_password', name: 'Student A' },
  { universityID: 'B12345678', password: 'student_password', name: 'Student B' },
];

const deans = [
  { universityID: 'D12345678', password: 'dean_password', name: 'Dean' },
];

const sessions = [];

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login for Student
app.post('/api/students/login', (req, res) => {
  const { universityID, password } = req.body;
  const user = users.find((u) => u.universityID === universityID && u.password === password);
  if (!user) return res.sendStatus(401);

  const token = jwt.sign({ universityID: user.universityID, name: user.name }, secretKey);
  res.json({ token });
});

// Get free sessions with Dean
app.get('/api/sessions', authenticateToken, (req, res) => {
  // Logic to get free sessions from the database (assuming sessions are pre-defined)
  const freeSessions = [
    { date: '2023-07-27', time: '10:00 AM' },
    { date: '2023-07-28', time: '10:00 AM' },
  ];
  res.json({ sessions: freeSessions });
});

// Book a session with Dean
app.post('/api/sessions/book', authenticateToken, (req, res) => {
  const { date, time } = req.body;
  // Logic to book a session in the database (simulating it by adding to the sessions array)
  sessions.push({ studentName: req.user.name, date, time });
  res.json({ message: 'Session booked successfully.' });
});

// Login for Dean
app.post('/api/deans/login', (req, res) => {
  const { universityID, password } = req.body;
  const dean = deans.find((d) => d.universityID === universityID && d.password === password);
  if (!dean) return res.sendStatus(401);

  const token = jwt.sign({ universityID: dean.universityID, name: dean.name }, secretKey);
  res.json({ token });
});

// Get pending sessions for Dean
app.get('/api/sessions/pending', authenticateToken, (req, res) => {
  const pendingSessions = sessions.filter((session) => session.studentName !== req.user.name);
  res.json({ sessions: pendingSessions });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
