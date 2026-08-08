# Mini Store Platform - Backend
The backend is a Node.js REST API that serves the Mini store. It handles authentication, products, the cart, the wishlist, and orders, and returns JSON to the frontend.

# Why Node.js and Express
I chose Node.js and Express because the whole project is JavaScript anyway, so there is no language switch between the backend and the frontend. Express is simple which let me set up the routes, middleware, and JSON responses quickly without learning a heavy framework.

# Data storage (the "Database")
Instead of using a real database like MongoDB or MySQL, I store everything in JSON files inside 'src/data/' (users.json, products.json, carts.json, orders.json, wishlists.json). I made this choice because the store is small and to for it to be easy to run and tested.

All reads and writes go through one helper file, 'src/utils/fileStore.js'. It loads each file into memory on the first read and keeps it cached, so we only hit the disk when something changes. 

# Step 1 - Project structure
I split the code into layers so each part has one job:

- Routes ('src/routes') - only map a URL to a controller.
- Controllers ('src/controllers') - handle the request and response and call the services.
- Services ('src/services') - the actual logic (register, add to cart, checkout ...).
- Models ('src/models') - build the data objects (a user, an order, a cart line ...).
- Utils ('src/utils') - shared helpers like the file store and ApiError.

# Step 2 - Authentication
I use JSON Web Tokens for auth. When a user registers or logs in, the server signs a token and sends it back. The frontend stores it in the local storage and sends it in the Authorization header on every request, and 'src/middlewares/auth.middleware.js' verifies it and loads the current user. Also passwords are never saved as plain text. On register the password is hashed with bcrypt before it is written to users.json, and on login I compare the entered password against the stored hash.

# Step 3 - Products
Filtering and pagination happen in 'product.service.js', not in the frontend. The list endpoint returns only 8 products at a time (it can be controlled from the frontend as pageSie), so the client doesn't download everything at once, and the same place handles the search text as well the size and color variant filters. Doing it on the backend keeps the request small and light.

# Step 4 - Cart and wishlist

Each user has his own cart. The cart only keeps the product id, the quantity and the chosen variants but when returned to frontend through api it returns the whole object of the product through the service logic.

## Step 5 - Order and checkout
Checkout 'order.service.js' takes the current cart, re-checks the stock, and then it decrements the stock of each product, then saves the order to orders.json, and clears the cart.

# Error handling
All API errors go through middleware. Services throw an 'ApiError' with a status code and a message, and the error middleware turns that into a clean JSON error body.

# Connecting to the frontend
The API runs on port 8000 (set in my .env file) and uses CORS to only accept requests from the frontend on localhost:3000. The frontend talks to it with fetch, sending the bearer token in the Authorization header.