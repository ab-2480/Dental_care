Dental Care – Dental Clinic Management System

A beginner-friendly full-stack web application designed to manage basic dental clinic operations.
The system supports two user roles: Patient and Doctor, with separate logins and dashboards.

--------------------------------------------------

Project Overview

The Dental Care Web Application helps digitize common clinic activities such as:
- Patient registration and login
- Doctor login and daily schedule
- Appointment booking
- Viewing patient details
- Writing prescriptions

The goal of this project is to reduce manual work in clinics and provide a simple digital solution.

--------------------------------------------------

User Roles

Patient:
- Register and login
- View list of doctors
- Book appointments
- View booked appointments
- View profile details

Doctor:
- Login separately
- View today’s appointments
- View patient details
- Write prescriptions
- View notifications

--------------------------------------------------

Technologies Used

Frontend:
- HTML
- CSS (Tailwind CSS)
- JavaScript
- React.js (with TypeScript)
- Vite (build tool)

Backend:
- Node.js
- Express.js
- TypeScript

Data Storage:
- JSON files (used for users, appointments, and prescriptions)

Note:
JSON storage is used for simplicity and academic purposes.
The project structure supports future migration to databases such as PostgreSQL.

--------------------------------------------------

Cloud and Deployment

- Current deployment: Localhost
- Cloud services: Not used (college project)
- Cloud-ready architecture for future deployment on:
  - AWS
  - Azure
  - Google Cloud

--------------------------------------------------

Project Structure

client/        -> React frontend
server/        -> Express backend
shared/        -> Shared schemas and route definitions
data/          -> JSON file storage
  - users.json
  - appointments.json
  - prescriptions.json

package.json
README.md

--------------------------------------------------

How to Run the Project Locally

Prerequisites:
- Node.js (LTS version recommended)
- VS Code

Steps:
1. Clone or download the repository
2. Open the project folder in VS Code
3. Open the terminal in VS Code
4. Install dependencies by running:
   npm install
5. Start the development server:
   npm run dev
6. Open your browser and go to:
   http://localhost:3000
