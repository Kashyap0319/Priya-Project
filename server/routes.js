const express = require('express');
const router = express.Router();
const data = require('./data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Register user (simple)
router.post('/users', (req, res) => {
  // Accepts { name, password }
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'name and password required' });
  const hash = bcrypt.hashSync(password, 8);
  const user = data.createUser({ name, passwordHash: hash });
  res.status(201).json({ id: user.id, name: user.name, createdAt: user.createdAt });
});

// Auth: login
router.post('/auth/login', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'name and password required' });
  // find user
  const all = data.listUsers ? data.listUsers() : [];
  const user = all.find((u) => u.name === name);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ sub: user.id, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// helper to protect routes
function ensureAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Submit passport application
router.post('/applications', (req, res) => {
  const appRecord = data.createApplication(req.body);
  res.status(201).json(appRecord);
});

// Get application by id
router.get('/applications/:id', (req, res) => {
  const rec = data.getApplication(req.params.id);
  if (!rec) return res.status(404).json({ error: 'not found' });
  res.json(rec);
});

// List applications
router.get('/applications', ensureAuth, (req, res) => {
  // return only applications for this user if user id provided
  const list = data.listApplications();
  const filtered = list.filter((a) => !a.userId || a.userId === req.user.sub);
  res.json(filtered);
});

// Appointment endpoints
router.post('/appointments', (req, res) => {
  const appt = data.createAppointment(req.body);
  res.status(201).json(appt);
});

router.put('/appointments/:id', (req, res) => {
  const updated = data.updateAppointment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

module.exports = router;
