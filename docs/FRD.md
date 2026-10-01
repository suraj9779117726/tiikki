# Functional Requirements Document — Tekki

**Product:** Tekki, a small internal tool for tracking work.  
**Audience:** One logged-in user managing their own projects and tasks.  
**Version:** 1.0

## 1. Purpose

Tekki lets an authenticated user create projects, add tasks inside those projects, and move each task through three statuses: Todo, In Progress, and Done.

## 2. Feature list

| ID | Feature | Notes |
| --- | --- | --- |
| F1 | Register | Name, email, and password. Account is created and the user is signed in. |
| F2 | Log in | Email and password. Returns a JWT used on later requests. |
| F3 | Log out | Clears the token on the client. |
| F4 | Session restore | On refresh, the app calls the current-user endpoint with the stored token. |
| F5 | Create project | Name required. Description optional. |
| F6 | List projects | Only projects owned by the signed-in user, newest activity first. |
| F7 | Open project | Shows the project and its tasks. |
| F8 | Update project | Name and description can be edited. |
| F9 | Delete project | Deletes the project and its tasks. |
| F10 | Create task | Title required. Description optional. Status defaults to Todo. |
| F11 | List tasks | Tasks for one project, grouped in the UI by status. |
| F12 | Update task status | Todo, In Progress, or Done. Title and description can also be updated by the API. |
| F13 | Delete task | Removes a single task. |
| F14 | Feedback | Screens show loading and error states. Forms are controlled. |

Out of scope for v1: teams, sharing, comments, attachments, email verification, password reset, and drag-and-drop.

## 3. User flow

1. The user opens the app and lands on the project list route.
2. If there is no valid session, the app shows the login screen.
3. A new user opens Register, submits name, email, and password, and is taken to the project list.
4. The user creates a project and opens it.
5. The user adds a task. It appears in the Todo column.
6. The user sets the status to In Progress or Done. The card moves to that column.
7. The user can edit or delete the project, and delete a task.
8. Log out returns the user to the login screen. Protected pages stay blocked until the next successful login.

## 4. Basic validations

| Field | Rule | Error behavior |
| --- | --- | --- |
| Name | Required, 2–50 characters after trim | 400 with a readable message |
| Email | Required, valid email, max 120 characters, stored lowercase | 400; duplicate email returns 409 |
| Password | Required, 6–72 characters | 400. Login failures use one message: "Invalid email or password" |
| Project name | Required, 2–80 characters | 400 |
| Project description | Optional, max 300 characters | 400 |
| Task title | Required, 2–120 characters | 400 |
| Task description | Optional, max 500 characters | 400 |
| Task status | `todo`, `in_progress`, or `done` | 400 |
| Ids | Must be MongoDB ObjectIds | 400 |
| Auth header | `Authorization: Bearer <jwt>` on every project and task route | 401 |
| Ownership | A user can only read or change their own projects and tasks | 404, so other users' ids are not confirmed |

The client repeats the length checks so the form can show a field error before the request. The server validation is the source of truth.

## 5. Assumptions

- Each user sees only their own data. There is no organization or invite model.
- The JWT is stored in `localStorage`. This is acceptable for this internal demo. A production app with a higher threat model would use httpOnly cookies.
- There is no email verification step. A unique email is enough to register.
- Passwords are hashed with bcrypt. Plain passwords are never stored or returned.
- Deleting a project deletes its tasks in the same request.
- The UI is English only.
- The API base URL, database URI, JWT secret, and allowed frontend origin come from environment variables.
- MongoDB is already available locally, or via MongoDB Atlas in deployment.
- One active status is stored on the task. Status history is not kept.

## 6. Success criteria

A reviewer can register, create a project, add a task, change its status, refresh the page, and still see the same data after signing in again.
