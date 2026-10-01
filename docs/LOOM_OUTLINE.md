# Loom outline (5–7 minutes)

Record the running app, the editor, and the Render/Vercel dashboards. Speak to the code you can point at.

## 1. End-to-end flow (about 90 seconds)

Show register, the empty project list, creating a project, adding a task, moving it from Todo to In Progress to Done, then refreshing the page. Say that the token in `localStorage` is sent as `Authorization: Bearer`, and that the API only returns projects and tasks whose `owner` is that user.

## 2. One backend API, line by line (about 2 minutes)

Use login.

- `backend/src/routes/authRoutes.js`: `POST /login` runs `loginValidation`, then `login`. The route file does not hash passwords or query MongoDB.
- `backend/src/middleware/validators.js`: the login rules require an email and a password, then `handleValidation` turns any failure into a 400 `AppError`.
- `backend/src/controllers/authController.js` `login`: load the user with `select('+passwordHash')` because the hash is hidden by default. Missing user and wrong password both throw `Invalid email or password`, so the response does not reveal which one failed. `bcrypt.compare` checks the password. `jwt.sign` puts the user id in the token. The response sends `user` and `token`, never the hash.
- `backend/src/middleware/errorHandler.js`: `AppError` keeps its status and message. An unexpected error is replaced with `Something went wrong` so a database message is not sent to the client.

## 3. One frontend component, line by line (about 90 seconds)

Use `frontend/src/components/StatusControl.jsx`.

- It receives the current status, an `onChange` callback, and `disabled`.
- It maps `TASK_STATUSES` from `constants/status.js`, so the labels are not copied into the component.
- Each option is a button with `aria-pressed`. The active one gets `is-active` and a status class.
- Clicking calls `onChange(status.value)`. The parent in `ProjectDetailPage` ignores a click on the current status, calls `PUT /api/tasks/:id` with `{ status }`, and replaces that task in state. While the request is in flight, `busy` disables the control.

`Button` and `Input` are the other reusable controls. Forms keep their values in `useState`.

## 4. Deployment (about 90 seconds)

Show the Render service with root directory `backend`, start command `npm start`, and the env vars `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. Open `/api/health`.

Show the Vercel or Netlify project with root directory `frontend` and `VITE_API_URL` set to the Render origin. Say that Vite bakes that value in at build time, so changing it requires a new build.

## 5. One mistake and the fix (about 45 seconds)

Helmet’s default `Cross-Origin-Resource-Policy` is `same-origin`. The React app and the API are on different origins, so the browser can block the frontend from reading a successful API response. `backend/src/app.js` sets that policy to `cross-origin`. CORS `CLIENT_ORIGIN` still decides which sites may call the API.

## Before you submit

Replace the placeholder deployment URLs in `README.md`, push the GitHub repo, paste the three links (repo, frontend, backend) plus this Loom, and keep `docs/FRD.md` in the repo.
