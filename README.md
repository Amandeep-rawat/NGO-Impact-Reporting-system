# NGO Impact Reporting System

A full-stack web application that allows NGOs to submit monthly impact reports and administrators to view aggregated data through a dashboard.

## Tech Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- shadcn/ui components
- React Hook Form with Zod validation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose


## Features

- **Report Submission Form**: NGOs can submit monthly reports with details on people helped, events conducted, and funds utilized.
- **Admin Dashboard**: View aggregated data for all NGOs by month.
- **Form Validation**: Client-side validation ensures data integrity.
- **Responsive Design**: Works on mobile, tablet, and desktop devices.

## Project Structure

### Frontend
- `/app`: Next.js app router pages
- `/components`: Reusable UI components
- `/public`: Static assets

### Backend
- `/models`: MongoDB schemas
- `/routes`: API endpoints
- `server.js`: Express server configuration

## API Endpoints

- `POST /api/report`: Submit a new NGO report
- `GET /api/dashboard?month=YYYY-MM`: Get aggregated data for a specific month



## Approach

This project was built with a focus on simplicity and functionality. The frontend uses Next.js with the App Router for efficient routing and server components. The backend uses Express.js with MongoDB for data storage.

The application follows a clean architecture with separation of concerns between the frontend and backend. Form validation is implemented on both client and server sides to ensure data integrity.

With more time, I would add authentication, more detailed reporting features, data visualization with charts, and historical trend analysis.

## Getting Started

### 1. Clone the repository

### 2. step to run the fontend
npm install --legacy-peer-deps
npm run dev


### 3.  step to run the backend 
cd backend
npm install
npm run dev

### 4.  env variables 
MONGO_URI=your_mongodb_connection_string
NODE_ENV= development for dev and for production use production
PORT=any port number

