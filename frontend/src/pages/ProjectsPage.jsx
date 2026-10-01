import { useCallback, useEffect, useState } from 'react';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Input, TextArea } from '../components/Input';
import { Layout } from '../components/Layout';
import { ProjectCard } from '../components/ProjectCard';
import { LIMITS } from '../constants/limits';
import { useAuth } from '../context/AuthContext';
import { createProject, listProjects } from '../api/projects';
import { validateProject } from '../utils/validate';

export function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await listProjects(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const nextErrors = validateProject(name, description);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setError('');
    try {
      const project = await createProject(token, {
        name: name.trim(),
        description: description.trim(),
      });
      setProjects((current) => [project, ...current]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-head">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Projects</h1>
        </div>
      </div>

      <form className="panel" onSubmit={handleCreate} noValidate>
        <div className="panel-copy">
          <h2>New project</h2>
          <p>Give the work a name. Add a short note if it needs one.</p>
        </div>
        <Input
          id="project-name"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          maxLength={LIMITS.projectName.max}
        />
        <TextArea
          id="project-description"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={fieldErrors.description}
          maxLength={LIMITS.projectDescription.max}
        />
        <Button type="submit" loading={submitting}>
          Create project
        </Button>
      </form>

      {error ? (
        <Alert>
          {error}{' '}
          <button type="button" className="text-button" onClick={loadProjects}>
            Try again
          </button>
        </Alert>
      ) : null}

      {loading ? <p className="page-loading">Loading projects…</p> : null}

      {!loading && projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="Create the first one above. Tasks live inside a project."
        />
      ) : null}

      {!loading && projects.length > 0 ? (
        <div className="card-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </Layout>
  );
}
