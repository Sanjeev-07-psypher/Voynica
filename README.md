# Voynica

A full-stack travel-stays marketplace where you can browse, list, and review unique places to stay — with photo uploads, interactive maps, search, and category filters.

🔗 **Live demo:** [voynica.vercel.app](https://voynica.vercel.app/listings)

---

## Features

- 🏠 Create, edit, and delete stay listings (with image upload)
- 🔍 Search by keyword and filter by 11 categories (Beaches, Mountain, Camping, …)
- 🗺️ Interactive Mapbox map with the listing location on each page
- ⭐ Leave and delete reviews with star ratings
- 🔐 User signup / login / logout (session-based auth)
- 💸 Toggle prices with/without taxes
- ☁️ Images stored on Cloudinary

## Tech stack

- **Backend:** Node.js, Express 5 (MVC structure)
- **Database:** MongoDB (Mongoose) — MongoDB Atlas in production
- **Views:** EJS + ejs-mate, Bootstrap 5
- **Auth:** Passport (local strategy) with sessions stored in MongoDB (connect-mongo)
- **Images:** Cloudinary (via Multer)
- **Maps / geocoding:** Mapbox
- **Validation:** Joi
- **Hosting:** Vercel (serverless)

## Getting started

**Prerequisites:** Node.js 18+, and free accounts for [MongoDB Atlas](https://www.mongodb.com/atlas), [Cloudinary](https://cloudinary.com), and [Mapbox](https://www.mapbox.com).

```bash
# 1. Clone and install
git clone https://github.com/Sanjeev-07-psypher/Voynica.git
cd Voynica
npm install

# 2. Create a .env file (see below)

# 3. Seed the database with sample listings
npm run seed

# 4. Run the app
npm run dev        # auto-reload during development
# or
npm start
```

The app runs at **http://localhost:3000**.

## Environment variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (ending in `/voynica`) |
| `SESSION_SECRET` | Any long random string for signing session cookies |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `MAP_TOKEN` | Mapbox public access token |

## Project structure

```
Voynica/
├── api/            # Vercel serverless entry
├── config/         # DB connection + Cloudinary setup
├── controllers/    # Route logic (listings, reviews, users)
├── middleware/     # Auth & validation middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── schemas/        # Joi validation schemas
├── views/          # EJS templates
├── public/         # CSS, client JS, assets
├── init/           # Database seed script + sample data
├── app.js          # Express app config
└── server.js       # Local dev entry point
```

Built by **Sanjeev Kumar Gupta**.
