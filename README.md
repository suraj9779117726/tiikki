# Tekki

Tekki is a small internal tool. A signed-in user can create projects, add tasks inside a project, and move each task between Todo, In Progress, and Done.

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Frontend: React, Vite, React Router
- Quality: ESLint, Prettier, Node’s built-in test runner

## Deployment URLs

| Surface | URL |
| --- | --- |
| Frontend | Not deployed yet. Deploy the `frontend` folder to Vercel or Netlify, then paste the URL here. |
| Backend | Not deployed yet. Deploy the `backend` folder to Render, then paste the URL here. |

The app is ready to deploy. The steps and the usual failure points are in [Deployment](#deployment).

## Local setup

Requirements: Node.js 20 or newer, and MongoDB. You can install MongoDB locally, use an Atlas cluster, or start it with Docker:

```powershell
docker run -d --name tekki-mongo -p 27017:27017 mongo:7
```

From the repository root, in PowerShell:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
npm install --prefix backend
npm install --prefix frontend
```

Edit `backend/.env` if MongoDB is not on `mongodb://127.0.0.1:27017/tekki`. Set `JWT_SECRET` to a long random string.

Start the API:

```powershell
npm run dev:api
```

Start the web app in a second terminal:

```powershell
npm run dev:web
```

Open `http://localhost:5173`. Register, create a project, add a task, and change its status.

Checks:

```powershell
npm test
npm run lint
npm run build --prefix frontend
```

## Folder structure

```text
docs/                 FRD, AI usage note, Loom outline
backend/
  src/
    config/           Environment variables, database, shared limits
    models/           User, Project, Task schemas
    middleware/       JWT check, request validation, error handler
    controllers/      Business logic for auth, projects, and tasks
    routes/           Path wiring only. No business logic here
    utils/            AppError and async wrapper
    app.js            Express app, without starting the server
    server.js         Connects MongoDB and listens
frontend/
  src/
    api/              Fetch wrapper and one module per resource
    components/       Button, Input, and the other reusable UI
    constants/        Limits and status values shared by the screens
    context/          Auth session
    pages/            Login, register, project list, task board
    utils/            Form checks and date formatting
```

Routes stay thin on purpose. A route file only attaches middleware and a controller. Validation lives in `middleware/validators.js`. Database writes live in the controllers.

## API list

All project and task routes need `Authorization: Bearer <token>`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness check |
| POST | `/api/auth/register` | Create an account and return a token |
| POST | `/api/auth/login` | Return a token |
| GET | `/api/auth/me` | Current user |
| GET | `/api/projects` | List the signed-in user's projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Read one project |
| PUT | `/api/projects/:id` | Update name and description |
| DELETE | `/api/projects/:id` | Delete the project and its tasks |
| GET | `/api/projects/:projectId/tasks` | List tasks in a project |
| POST | `/api/projects/:projectId/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update title, description, and/or status |
| DELETE | `/api/tasks/:id` | Delete a task |

Successful responses look like `{ "success": true, "data": { } }`. Errors look like `{ "success": false, "message": "..." }`.

Task status values are `todo`, `in_progress`, and `done`.

## Deployment

### Backend on Render

1. Push this repository to GitHub.
2. In Render, create a Web Service from the repo.
3. Set the root directory to `backend`.
4. Build command: `npm install`. Start command: `npm start`.
5. Add environment variables:
   - `MONGODB_URI` — Atlas connection string
   - `JWT_SECRET` — long random string
   - `CLIENT_ORIGIN` — the deployed frontend origin, with `https://` and no trailing slash. Several origins can be comma-separated.
   - `JWT_EXPIRES_IN` — `7d`
6. In Atlas, allow network access from anywhere (`0.0.0.0/0`) if the cluster is not already reachable from Render. Render’s outbound IP changes.
7. Open `https://<your-service>.onrender.com/api/health`. You should see `{ "success": true, "data": { "status": "ok" } }`.

### Frontend on Vercel or Netlify

1. Import the same GitHub repository.
2. Set the root directory to `frontend`.
3. Framework: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Set `VITE_API_URL` to the Render URL, with no trailing slash. Example: `https://tekki-api.onrender.com`.
5. Redeploy after changing `VITE_API_URL`. Vite reads it at build time, so a later change in the dashboard does nothing until the next build.
6. Put the deployed frontend origin into the API’s `CLIENT_ORIGIN` and redeploy the API if that value changed.

Netlify uses `frontend/public/_redirects` so a refresh on `/projects` still loads the app. Vercel uses `frontend/vercel.json` for the same reason.

### Common deployment issues

- **CORS error in the browser.** `CLIENT_ORIGIN` must match the frontend origin exactly, including `https` and no trailing slash.
- **Frontend calls localhost in production.** `VITE_API_URL` was missing during the build. Set it and redeploy.
- **`/api/health` works, but the app cannot sign in.** The Atlas IP allowlist is blocking Render, or `MONGODB_URI` is wrong. Render logs show the connection error.
- **Refresh on a project page returns 404.** The host is not rewriting unknown paths to `index.html`.
- **First request after idle is slow or times out.** Render’s free instance sleeps. The next request wakes it.
- **Every user is logged out after a redeploy.** `JWT_SECRET` changed, so old tokens no longer verify.

## AI usage

See [docs/AI_USAGE.md](docs/AI_USAGE.md).

## Planning

The feature list, user flow, validations, and assumptions are in [docs/FRD.md](docs/FRD.md).

A speaking outline for the 5–7 minute Loom is in [docs/LOOM_OUTLINE.md](docs/LOOM_OUTLINE.md).
