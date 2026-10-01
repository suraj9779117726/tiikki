import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LIMITS } from '../constants/limits';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validate';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="page-loading">Loading your workspace…</p>;
  if (user) return <Navigate to="/projects" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(email, password);
    setFieldErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      lede="Sign in to pick up your projects."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {error ? <Alert>{error}</Alert> : null}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
          maxLength={LIMITS.email.max}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          autoComplete="current-password"
          maxLength={LIMITS.password.max}
        />
        <Button type="submit" loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
