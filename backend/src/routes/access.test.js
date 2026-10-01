import assert from 'node:assert/strict';
import test from 'node:test';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/tekki-test';
process.env.JWT_SECRET ||= 'test-secret-value';
process.env.CLIENT_ORIGIN ||= 'http://localhost:5173';

const { app } = await import('../app.js');

function listen(application) {
  return new Promise((resolve) => {
    const server = application.listen(0, () => resolve(server));
  });
}

test('register rejects a name that is too short', async () => {
  const server = await listen(app);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'ada@example.com',
        password: 'secret12',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.match(body.message, /Name must be between/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('project routes reject missing tokens before touching the database', async () => {
  const server = await listen(app);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/projects`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.message, 'Authentication required');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
