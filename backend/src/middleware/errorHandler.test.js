import assert from 'node:assert/strict';
import test from 'node:test';
import { errorHandler } from './errorHandler.js';
import { AppError } from '../utils/AppError.js';

function mockResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('errorHandler returns the status and message from AppError', () => {
  const res = mockResponse();
  errorHandler(new AppError('Name is required', 400), {}, res, () => {});
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, message: 'Name is required' });
});

test('errorHandler maps a duplicate key to 409', () => {
  const res = mockResponse();
  errorHandler(
    { code: 11000, message: 'E11000 duplicate key' },
    {},
    res,
    () => {},
  );
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.message, 'A record with this value already exists');
});

test('errorHandler hides unexpected server errors', () => {
  const res = mockResponse();
  errorHandler(new Error('connection string leaked'), {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Something went wrong');
});
