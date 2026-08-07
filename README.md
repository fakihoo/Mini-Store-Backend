# mini_store_backend

Express.js backend for a mini store.

## Project structure

```
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
```

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm start` - run in production mode
- `npm run dev` - run in development mode
