# To-Do List App (MERN)

Full-stack To-Do List: **Node.js + Express + MongoDB** backend, **React (Vite) + Axios** frontend.

## Features
- Create, read, update, delete tasks
- Update status (`pending`, `in-progress`, `completed`)
- Search (title/description) and filter by status/priority
- Controller → Service → Model layering, validation, centralized error handling
- Loading indicators and friendly error messages in the UI

## Project structure
```
backend/
  server.js
  src/{config,models,services,controllers,routes,middleware}
frontend/
  src/{api.js, App.jsx, components/}
```

## Run locally
**Prerequisites:** Node 18+, MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env     # edit MONGO_URI
npm run dev              # http://localhost:5000
```
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Allowed frontend origin(s), comma separated |

### Frontend
```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_URL
npm run dev              # http://localhost:5173
```
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000/api` |

## API reference
Base: `/api/tasks`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/` | – | List tasks. Query: `search`, `status`, `priority` |
| GET | `/:id` | – | Get one task |
| POST | `/` | `{title, description?, status?, priority?, dueDate?}` | Create |
| PUT | `/:id` | any task fields | Update |
| PATCH | `/:id/status` | `{status}` | Update status |
| DELETE | `/:id` | – | Delete |

Responses: `{ success: true, data }` or `{ success: false, message }`.

### Quick test (or use the same requests in Postman)
```bash
curl -X POST localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Learn Express"}'
curl "localhost:5000/api/tasks?search=express&status=pending"
curl -X PATCH localhost:5000/api/tasks/<id>/status -H "Content-Type: application/json" -d '{"status":"completed"}'
curl -X DELETE localhost:5000/api/tasks/<id>
```

## Deployment
**Backend → Render** (Web Service)
- Root directory: `backend` · Build: `npm install` · Start: `npm start`
- Env vars: `MONGO_URI` (MongoDB Atlas), `CLIENT_URL` (your Netlify URL)

**Frontend → Netlify**
- Base directory: `frontend` · Build: `npm run build` · Publish: `frontend/dist`
- Env var: `VITE_API_URL=https://<your-render-app>.onrender.com/api`

## Challenges & how I solved them
- **CORS errors** between Netlify and Render → configured `cors` with an allow-list from `CLIENT_URL`.
- **Invalid IDs crashing requests** → `validateId` middleware plus Mongoose `CastError` handling.
- **Too many API calls while typing in search** → 300 ms debounce in `useEffect`.
- **Repeated try/catch in controllers** → `asyncHandler` wrapper + one global error handler.
- **Render free-tier cold starts** → added a loading indicator so the UI doesn't look broken.

## Design decisions
- A service layer keeps business logic out of controllers, so it is easy to test and change.
- Search/filter run server-side so the UI stays fast as the list grows.
- After each mutation the UI re-fetches, guaranteeing the frontend matches the database.
