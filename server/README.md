# Server (e-Passport minimal API)

Requirements
- Node.js 18+ (Windows)

Run (PowerShell)

Install dependencies:

npm install

Start server:

npm start

The server listens on http://localhost:4000 by default.

Quick checks (PowerShell):

Invoke-RestMethod http://localhost:4000/api/health

Create a user:

Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"name":"Alice"}' http://localhost:4000/api/users

Submit application:

Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"userId":"<id>","passportType":"e-passport"}' http://localhost:4000/api/applications

Sample curl (PowerShell) for health:

curl http://localhost:4000/api/health

