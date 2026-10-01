import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LIMITS } from '../constants/limits';
import { useAuth } from '../context/AuthContext';
import { validateAccount } from '../utils/validate';

export function RegisterPage() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="page-loading">Loading your workspace…</p>;
  if (user) return <Navigate to="/projects" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateAccount({ name, email, password });
    setFieldErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      lede="Use your email. No invite is required."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error ? <Alert>{error}</Alert> : null}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          autoComplete="name"
          maxLength={LIMITS.name.max}
        />
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
          autoComplete="new-password"
          maxLength={LIMITS.password.max}
        />
        <Button type="submit" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
