const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let state = {
  users: {},
  applications: {},
  appointments: {},
};

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      state = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load data file', err);
  }
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write data file', err);
  }
}

load();

function createUser(payload) {
  const id = uuidv4();
  const user = { id, ...payload, createdAt: new Date().toISOString() };
  state.users[id] = user;
  persist();
  return user;
}

function createApplication(payload) {
  const id = uuidv4();
  const record = { id, status: 'submitted', ...payload, createdAt: new Date().toISOString() };
  state.applications[id] = record;
  persist();
  return record;
}

function getApplication(id) {
  return state.applications[id];
}

function listApplications() {
  return Object.values(state.applications);
}

function listUsers() {
  return Object.values(state.users);
}

function getUser(id) {
  return state.users[id];
}

function createAppointment(payload) {
  const id = uuidv4();
  const rec = { id, ...payload, createdAt: new Date().toISOString() };
  state.appointments[id] = rec;
  persist();
  return rec;
}

function updateAppointment(id, payload) {
  if (!state.appointments[id]) return null;
  const existing = state.appointments[id];
  const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
  state.appointments[id] = updated;
  persist();
  return updated;
}

module.exports = {
  createUser,
  createApplication,
  getApplication,
  listApplications,
  listUsers,
  getUser,
  createAppointment,
  updateAppointment,
};
