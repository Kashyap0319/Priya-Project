const API = 'http://localhost:4000/api';
let token = null;

function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  return h;
}

document.getElementById('btnRegister').onclick = async () => {
  const name = document.getElementById('userName').value;
  const password = document.getElementById('userPassword').value;
  const res = await fetch(API + '/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) });
  const data = await res.json();
  document.getElementById('userResult').innerText = JSON.stringify(data, null, 2);
};

document.getElementById('btnLogin').onclick = async () => {
  const name = document.getElementById('loginName').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById('loginResult').innerText = 'Logged in — token stored in memory';
  } else {
    document.getElementById('loginResult').innerText = JSON.stringify(data, null, 2);
  }
};

document.getElementById('btnSubmitApp').onclick = async () => {
  const userId = document.getElementById('appUserId').value;
  const res = await fetch(API + '/applications', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ userId, passportType: 'e-passport' }) });
  const data = await res.json();
  document.getElementById('appResult').innerText = JSON.stringify(data, null, 2);
};

document.getElementById('btnAppt').onclick = async () => {
  const userId = document.getElementById('apptUserId').value;
  const slot = document.getElementById('apptSlot').value;
  const res = await fetch(API + '/appointments', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ userId, slot }) });
  const data = await res.json();
  document.getElementById('apptResult').innerText = JSON.stringify(data, null, 2);
};
