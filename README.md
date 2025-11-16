Skyport🚀

A modern cargo delivery platform that connects travelers (carriers) with users who need to send items. Swift-Link enables secure, real-time–tracked shipments using a user-friendly mobile application and a robust backend API.

🎯 Project Overview

Skyport is a full-stack cargo delivery system that facilitates secure, reliable, and fast item delivery through verified travelers.
The platform supports multiple roles with advanced authentication, real-time tracking, payment processing, live customer support, and a smooth mobile experience.

✨ Key Features
🔐 Authentication & Security

JWT-based authentication

OTP phone verification

National ID verification

Role-based access control (Carrier, Sender, Receiver, Agent)

Admin/Agent approval for new users

✈️ Flight & Shipment Management

Carriers create and manage flights with available cargo space

Senders request shipments based on available flights

Unique tracking codes for real-time shipment tracking

Delivery confirmations using verification codes

Flight status updates (on-time, delayed, canceled)

💳 Payment Integration

Integrated with Chapa payment gateway

Secure payment initialization and verification

Automated payment release after delivery confirmation

Platform fee and revenue management

💬 Real-Time Customer Support

Live chat with Socket.io

Agent dashboard for support

Chat history and user management

Real-time message notifications

🎁 Rewards System

Carriers earn points per successful delivery

Reward tracking and redemption system

📱 Mobile Application

Cross-platform (Android, iOS, Web) with React Native

Role-based dashboards

Modern and responsive UI

Landing page with an animated video background

🛠 Tech Stack
Backend

Node.js

Express.js (v5.1.0)

MongoDB

Prisma ORM (v6.17.1)

JSON Web Tokens (JWT)

Socket.io (v4.8.1)

bcryptjs

Chapa Payment API

TextBee SMS API

Nodemon (development)

Frontend

React Native (v0.81.4)

Expo (v54.0.13)

React Navigation (v7)

Context API

AsyncStorage

Socket.io Client

Expo Vector Icons, React Native Animatable

Expo Video

📦 Installation
Prerequisites

Node.js (v18+)

npm or yarn

MongoDB (local or cloud)

Expo CLI

Git

📥 Clone the Repository
git clone https://github.com/yathrib-04/Swift-Link.git
cd Swift-Link

📚 Install Dependencies
# Root dependencies
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

🧩 Prisma Setup
cd backend

# Generate client
npx prisma generate

# Run migrations (optional)
npx prisma migrate dev

# Seed database (optional)
node seed.js

⚙️ Environment Setup
Backend .env
DATABASE_URL="mongodb://localhost:27017/swiftlink"

JWT_SECRET="your-secret-key-min-32-chars"

PORT=5000
NODE_ENV=development

TEXTBEE_DEVICE_ID="your-textbee-device-id"
TEXTBEE_API_KEY="your-textbee-api-key"

CHAPA_BASE_URL="https://api.chapa.co/v1/transaction/initialize"
CHAPA_SECRET_KEY="your-chapa-secret-key"

Frontend

Update your API base URL:

Local: http://localhost:5000

Physical device: http://your-ip-address:5000

🚀 Running the Project
Option 1: Run Everything Together
npm run dev

Option 2: Run Separately
Backend
cd backend
npm run dev


Server runs on: http://localhost:5000

Frontend
cd frontend
npm start


Select:

a → Android

i → iOS

w → Web

Or scan QR using Expo Go

📝 License

This project is licensed under the ISC License.

👤 Author

Teyiba Aman — GitHub Profile

Made with ❤️ to make cargo delivery simple, fast, and secure.