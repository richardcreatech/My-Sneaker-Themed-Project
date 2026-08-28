# Sneakers Store - Backend

Backend API for the Sneakers Store e-commerce application.

This project provides the server-side functionality for the Sneakers Store frontend, including product data, shopping carts, orders, users, and database access.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Supabase
- Supabase JavaScript Client
- dotenv
- CORS

## Architecture

The backend is responsible for handling application logic and communicating with the PostgreSQL database hosted on Supabase.

```text
React Frontend
      │
      │ HTTP Requests
      ▼
Express Server
      │
      │ Supabase Data API
      ▼
Supabase
      │
      ▼
PostgreSQL Database