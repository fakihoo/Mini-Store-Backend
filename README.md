# Mini Store Backend

Express.js backend for a mini store.

# Project structure
src/
├── config/       # Environment & database configuration
├── controllers/  # Route handlers (request/response logic)
├── models/       # Database models (user, product, cart, order)
├── routes/       # API route definitions
├── middlewares/  # Custom middleware (auth, validation, error handling)
├── services/     # Reusable business logic (auth, email, etc.)
├── utils/        # Helper functions (logger, validators, ApiError)
├── app.js        # Express app setup
└── server.js     # Server entry point

# Rinning the App

# Step 1
navigate to the terminal

# Step 2
npm install

# Step 3 "Run the backend to port 8000"
node ./src/server.js
