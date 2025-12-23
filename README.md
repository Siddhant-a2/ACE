# ACE 

[![version](https://img.shields.io/badge/version-1.0.0-blue)](backend/package.json) [![license](https://img.shields.io/badge/license-ISC-lightgrey)](LICENSE)

A full‑stack web application prototype combining a Vite + React frontend with an Express + MongoDB backend. 

**Key features**
- User authentication (signup, login, cookies & JWT)
- Event CRUD (create, read, update, delete)
- Image uploads and Cloudinary signature generation
- React context stores for auth, events and uploads
- Vite + Tailwind/DaisyUI frontend layouts and preview components

---

## Quick start

Prerequisites
- Node.js 18+ (or your preferred LTS)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account for image uploads (optional but recommended)

1) Clone the repository

```bash
git clone <your-repo-url> ace
cd ace
```

2) Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with at least the following variables:

```
PORT=5001
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Run backend (development):

```bash
npm run dev
```

Backend scripts: see [backend/package.json](backend/package.json#L1)

3) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs with Vite and expects the backend at `http://localhost:5001` by default. If needed, update API base URLs in `frontend/src/lib/axios.js` or your environment configuration.

Frontend scripts: see [frontend/package.json](frontend/package.json#L1)

---

## Additional Requirement

Only admins can currently create accounts. To enable public signup temporarily:

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Edit the signup route in backend/routes/auth.route.js — remove the adminPrivilage middleware. Example change:

Before:

`router.post('/signup', adminPrivilage, signupController);`

After:

`router.post('/signup', signupController);`

3. Restart the backend (if it didn’t restart automatically) and send a POST request (Postman or curl) to the signup endpoint:

URL:
`http://localhost:<PORT>/api/auth/v1/signup`


Body (JSON, raw): 
`{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securePassword123"
}`


## Project structure (high level)
- `backend/` — Express API, MongoDB models, controllers, Cloudinary integration
  - `src/index.js` — server bootstrap and route mounting
  - `src/controllers/` — auth, event and upload controllers
  - `src/models/` — `user.model.js`, `event.model.js`
- `frontend/` — Vite + React app with components, pages and stores
  - `src/main.jsx` — app entry and providers
  - `src/pages/` — top-level pages (Home, Login, Profile, AddEvent, ViewEvent)
  - `src/store/` — React context hooks for auth, events and signatures

Refer to these files for implementation details: [backend/src/index.js](backend/src/index.js#L1) and [frontend/src/main.jsx](frontend/src/main.jsx#L1).

---

## Environment & configuration
- Backend expects `MONGO_URI`, `PORT`, `JWT_SECRET`, and Cloudinary keys.
- Frontend uses `vite` dev server (default `http://localhost:5173`). Update CORS origin in `backend/src/index.js` if needed.

## Running & building
- Start backend (dev): `cd backend && npm run dev`
- Start frontend (dev): `cd frontend && npm run dev`
- Build frontend for production: `cd frontend && npm run build`

## Where to get help
- Open an issue in this repository for bugs or feature requests.
- For questions about running locally, include: OS, Node version, and any error logs.

## Contributing
If you'd like to contribute, please read `CONTRIBUTING.md` (if present) or add an issue describing the change you want to make. Keep PRs small and focused; include tests where appropriate. For frontend styling, follow the existing Tailwind + DaisyUI patterns.

Useful pointers:
- Review `frontend/README.md` for any frontend-specific notes.
- Backend helpers: `backend/src/libs/utils.js` and DB setup at `backend/src/libs/db.js`.

---

## Maintainers
This repository is maintained by the project owners. Update this section with explicit maintainer/contact information.
