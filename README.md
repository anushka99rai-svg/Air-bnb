# 🌍 Wanderlust (Airbnb Clone)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A full-stack web application replicating core functionalities of **Airbnb**, built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. Wanderlust allows users to explore, create, edit, and manage curated travel accommodation listings around the world, as well as share and manage property reviews and ratings.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [RESTful Routes](#-restful-routes)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Seeding](#-database-seeding)
- [Running the App](#-running-the-app)
- [Validation & Error Handling](#-validation--error-handling)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)
- [License](#-license)

---

## 🌟 Overview

**Wanderlust** is designed to provide travelers and hosts with an intuitive lodging marketplace experience. The application implements standard RESTful design principles, robust asynchronous error handling, relational data modeling with Mongoose (one-to-many relationships with listings and reviews), and schema validation on both client and server sides.

---

## ✨ Key Features

- **Listing Management (Full CRUD)**:
  - **Create**: Add new properties with custom titles, descriptions, pricing, locations, and images.
  - **Read**: Explore all property listings in a responsive card grid, or click into a listing for detailed views.
  - **Update**: Edit existing listing details via pre-filled forms.
  - **Delete**: Remove listings safely with automatic redirection.
- **Reviews & Ratings System**:
  - Leave reviews with star ratings (1 to 5) and custom comments for any property.
  - View all community reviews presented in a clean, multi-column card layout on the listing details page.
  - Delete individual reviews with automatic Mongoose `$pull` reference cleanup from the parent listing.
- **Responsive & Modern UI**:
  - Templating powered by `ejs-mate` layouts and modular EJS partials (Navbar, Footer).
  - Modern styling using Bootstrap and custom typography (Google Sans, Font Awesome).
  - Currency localized display in Indian Rupees (INR).
- **Client & Server Validation**:
  - Real-time client-side form validation feedback with custom JavaScript.
  - Robust server-side schema verification powered by **Joi** for listings and reviews.
- **Centralized Error Handling**:
  - Custom `ExpressError` class for standard HTTP status codes.
  - `wrapAsync` utility function to catch and forward asynchronous exceptions without crashing the server.
  - Dedicated user-friendly error display page and catch-all 404 handler.
- **Database Seeding**:
  - Pre-configured dataset with curated vacation stays across global destinations.

---

## 🛠 Tech Stack

### **Backend**
- **Node.js** - Asynchronous event-driven JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **Joi** - Powerful schema description language and data validator
- **Method-Override** - HTTP verb simulation (`PATCH`, `DELETE`) for HTML forms

### **Frontend & Templating**
- **EJS (Embedded JavaScript)** - Templating engine for dynamic HTML rendering
- **EJS-Mate** - Layout and boilerplate engine for EJS
- **Bootstrap 6 (Alpha)** - Responsive layout and UI component library
- **Font Awesome** - Scalable vector icons
- **Custom CSS** - Styling and typography

---

## 📁 Project Architecture

```text
AirBnb/
├── init/                     # Database initialization and seed data
│   ├── data.js               # Sample listing dataset
│   └── index.js              # Script to populate MongoDB with initial data
├── models/                   # Mongoose schemas and data models
│   ├── listing.js            # Listing model definition (with reviews ref)
│   └── review.js             # Review model definition
├── public/                   # Static assets served by Express
│   ├── css/
│   │   └── style.css         # Custom layout, card, and navbar styles
│   └── js/
│       └── validateForm.js   # Client-side form validation script
├── utils/                    # Helper utilities
│   ├── ExpressError.js       # Custom error class
│   └── wrapAsync.js          # Async wrapper middleware for route handlers
├── views/                    # EJS templates
│   ├── includes/             # Shared partials
│   │   ├── footer.ejs        # Footer component with links & social icons
│   │   └── navbar.ejs        # Responsive navigation bar
│   ├── layouts/
│   │   └── boilerplate.ejs   # Base layout with CDN links & boilerplate markup
│   └── listings/             # Listing view templates
│       ├── edit.ejs          # Edit listing form
│       ├── error.ejs         # Error display page
│       ├── index.ejs         # All listings catalog page
│       ├── new.ejs           # Create listing form
│       └── show.ejs          # Listing details view with review form & list
├── app.js                    # Application entry point and route configurations
├── schema.js                 # Joi validation schemas (listings & reviews)
├── package.json              # Project metadata, scripts, and dependencies
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## 🧭 RESTful Routes

The application follows standard REST architectural conventions:

### Listings Routes

| HTTP Method | Route | Description | Action / View |
|:---|:---|:---|:---|
| **GET** | `/` | Root health check | Simple landing message |
| **GET** | `/listings` | Display list of all listings | `views/listings/index.ejs` |
| **GET** | `/listings/new` | Form to create a new listing | `views/listings/new.ejs` |
| **POST** | `/listings` | Create a new listing | Database insert & redirect to `/listings` |
| **GET** | `/listings/:id` | Show specific listing & populated reviews | `views/listings/show.ejs` |
| **GET** | `/listings/:id/edit` | Form to edit an existing listing | `views/listings/edit.ejs` |
| **PATCH** | `/listings/:id` | Update a specific listing | Database update & redirect to `/listings` |
| **DELETE** | `/listings/:id` | Delete a specific listing | Database delete & redirect to `/listings` |

### Reviews Routes

| HTTP Method | Route | Description | Action / View |
|:---|:---|:---|:---|
| **POST** | `/listings/:id/reviews` | Create a new review for a listing | Insert review, push ref to listing & redirect to `/listings/:id` |
| **DELETE** | `/listings/:id/reviews/:reviewId` | Delete a review from a listing | Remove review document, `$pull` ref from listing & redirect to `/listings/:id` |

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a remote [MongoDB Atlas](https://www.mongodb.com/atlas) URI)
- [Git](https://git-scm.com/)

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anushka99rai-svg/Air-bnb.git
   cd Air-bnb
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Verify MongoDB Connection**:
   Make sure your local MongoDB daemon is running:
   ```bash
   # On macOS/Linux (using Homebrew/systemd)
   brew services start mongodb-community
   # Or on Windows (PowerShell / Command Prompt as Admin)
   net start MongoDB
   ```

   > Default connection URI configured in `app.js`: `mongodb://127.0.0.1:27017/wanderlust`

---

## 📦 Database Seeding

To seed your MongoDB database with sample vacation stays:

```bash
node init/index.js
```

You should see:
```text
Connection successful
Data saved successfully
```

---

## 💻 Running the App

Start the Express development server:

```bash
node app.js
```

Or with `nodemon` for auto-reloading during development:
```bash
npx nodemon app.js
```

Once started, open your web browser and navigate to:
```text
http://localhost:8080/listings
```

---

## 🛡 Validation & Error Handling

- **Client-Side Validation**:
  Forms use Bootstrap validation styles alongside custom validation logic in `public/js/validateForm.js` to prevent submitting empty or invalid inputs.

- **Server-Side Validation**:
  - Listings incoming requests are validated against `listingSchema` in `schema.js`.
  - Reviews incoming requests are validated against `reviewSchema` in `schema.js` (requiring ratings between 1 and 5 and comments).
  - Any malformed data immediately triggers a `400 Bad Request` with descriptive error details.

- **Global Error Handling**:
  All asynchronous controller operations are wrapped in `wrapAsync` to funnel unhandled exceptions to the centralized error middleware in `app.js`, which renders `views/listings/error.ejs` with appropriate status codes and error messages.

---

## 🔮 Future Enhancements

- [ ] **User Authentication & Authorization**: User registration, login, and permissions using Passport.js.
- [x] **Reviews & Ratings**: Allow guests to leave reviews and 1–5 star ratings for stays.
- [ ] **Interactive Maps**: Integrate Mapbox SDK or Google Maps API for geolocation visualization.
- [ ] **Cloud Image Uploads**: Replace URL inputs with file uploads directly to Cloudinary or AWS S3.
- [ ] **Search & Filtering**: Search by location, title, or filter by category (Beachfront, Cabins, Iconic Cities).

---

## 👩‍💻 Author

**Anushka Rai**
- GitHub: [@anushka99rai-svg](https://github.com/anushka99rai-svg)

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
