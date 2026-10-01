# AI usage declaration

Cursor, using Grok, was used to draft this repository: the FRD, the Express API, the React UI, the tests, and the docs.

The code is organized so each piece can be explained on its own. Before the review, read these files until the explanation does not depend on the chat that produced them:

- `backend/src/controllers/authController.js` — register and login
- `backend/src/middleware/auth.js` — how a JWT becomes `req.user`
- `backend/src/routes/authRoutes.js` — the route file only wires middleware and controllers
- `frontend/src/components/StatusControl.jsx` — the status control on a task card
- `frontend/src/api/client.js` — how the UI calls the API

If a line in those files is unclear, change it until it is clear. The review expects a line-by-line explanation of one API and one component, and a rejection if that explanation cannot be given.
