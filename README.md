
# PeopleDesk - Employee Management System

PeopleDesk is an Employee Management System built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

It provides separate login access and dashboards for administrators and employees.

## Technologies Used

- MongoDB Atlas
- MongoDB Compass
- Express.js
- React.js
- Node.js
- JavaScript
- CSS

## Features

- User Authentication
- Role-Based Login
- Admin Dashboard
- Employee Dashboard
- Employee Management
- Department Management
- Attendance Management
- Task Management
- Salary Management
- Leave Management
- Reports
- Notifications
- Settings

## Project Structure

```text
EMS/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/khushidholariya55/EMS.git
cd EMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure:

- PORT
- MONGO_URI
- JWT_SECRET
- Admin credentials

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

## Security

Never upload your `.env` file or expose MongoDB credentials, JWT secrets, or passwords.

## Author

Khushi Dholariya
