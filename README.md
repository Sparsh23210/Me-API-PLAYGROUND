Me-API Playground 🚀

A simple backend + minimal frontend project that stores my own profile information in a MongoDB database and exposes it via a small API.
This project is part of the Backend Assessment.

🔹 Architecture

Backend: Node.js + Express

Database: MongoDB (Mongoose ODM)

Frontend: React (minimal UI for querying skills, projects, and profile)

Hosting: (Update with your hosting provider — e.g., Render, Vercel, Netlify)

🔹 Features

CRUD API for profile data:

Profile → name, email, education, skills, projects, work, links (GitHub, LinkedIn, portfolio)

Query Endpoints:

GET /projects?skill=python → Get projects filtered by skill

GET /skills/top → Get top skills

GET /search?q=keyword → Search across profile, projects, skills

Health Check:

GET /health → returns 200 OK

CORS enabled for frontend calls

🔹 Setup Instructions
1️⃣ Clone the Repo
git clone <your_repo_link>
cd me-api-playground

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/projectdb


Start backend:

npm start

3️⃣ Database Setup

MongoDB is used to store:

Profile

Education

Skills

Projects

Work history

Links (GitHub, LinkedIn, Portfolio)

Schema definitions included in schema.md

4️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend lets you:

Search by skill

View projects

View profile

🔹 API Endpoints
Method	Endpoint	Description
GET	/health	Health check (returns 200)
GET	/profile	Fetch my profile
POST	/profile	Create/Update profile
GET	/projects?skill=xyz	Get projects by skill
GET	/skills/top	Get top skills
GET	/search?q=keyword	Search across profile, projects
🔹 Sample cURL / Postman

Health Check

curl http://localhost:5000/health


Search Projects

curl "http://localhost:5000/projects?skill=react"


Postman collection: postman_collection.json included.
