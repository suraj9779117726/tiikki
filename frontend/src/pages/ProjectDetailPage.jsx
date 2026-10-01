import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProject, getProject, updateProject } from '../api/projects';
import { createTask, deleteTask, listTasks, updateTask } from '../api/tasks';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { LIMITS } from '../constants/limits';
import { TASK_STATUSES } from '../constants/status';
import { useAuth } from '../context/AuthContext';
import { validateProject, validateTask } from '../utils/validate';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState('');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextProject, nextTasks] = await Promise.all([
        getProject(token, projectId),
        listTasks(token, projectId),
      ]);
      setProject(nextProject);
      setTasks(nextTasks);
      setEditName(nextProject.name);
      setEditDescription(nextProject.description || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    const nextErrors = validateTask(title, description);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCreating(true);
    setError('');
    try {
      const task = await createTask(token, projectId, {
        title: title.trim(),
        description: description.trim(),
      });
      setTasks((current) => [task, ...current]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    if (status === task.status) return;
    setBusyTaskId(task.id);
    setError('');
    try {
      const updated = await updateTask(token, task.id, { status });
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? updated : item)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTaskId('');
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setBusyTaskId(task.id);
    setError('');
    try {
      await deleteTask(token, task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTaskId('');
    }
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();
    const nextErrors = validateProject(editName, editDescription);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSavingProject(true);
    setError('');
    try {
      const updated = await updateProject(token, projectId, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setProject((current) => ({ ...current, ...updated }));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (!window.confirm(`Delete "${project.name}" and all of its tasks?`))
      return;
    setDeletingProject(true);
    setError('');
    try {
      await deleteProject(token, projectId);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
      setDeletingProject(false);
    }
  };

  return (
    <Layout>
      <Link to="/projects" className="back-link">
        All projects
      </Link>

      {loading ? <p className="page-loading">Loading tasks…</p> : null}
      {error ? (
        <Alert>
          {error}{' '}
          {!project ? (
            <button type="button" className="text-button" onClick={load}>
              Try again
            </button>
          ) : null}
        </Alert>
      ) : null}

      {!loading && project ? (
        <>
          <div className="page-head">
            <div>
              <p className="eyebrow">Project</p>
              <h1>{project.name}</h1>
              {project.description ? (
                <p className="lede">{project.description}</p>
              ) : null}
            </div>
            <div className="head-actions">
              <Button
                variant="ghost"
                onClick={() => setEditing((open) => !open)}
              >
                {editing ? 'Close' : 'Edit project'}
              </Button>
              <Button
                variant="danger"
                loading={deletingProject}
                onClick={handleDeleteProject}
              >
                Delete project
              </Button>
            </div>
          </div>

          {editing ? (
            <form className="panel" onSubmit={handleSaveProject} noValidate>
              <Input
                id="edit-name"
                label="Name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                error={editErrors.name}
                maxLength={LIMITS.projectName.max}
              />
              <TextArea
                id="edit-description"
                label="Description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                error={editErrors.description}
                maxLength={LIMITS.projectDescription.max}
              />
              <Button type="submit" loading={savingProject}>
                Save changes
              </Button>
            </form>
          ) : null}

          <form className="panel" onSubmit={handleCreateTask} noValidate>
            <div className="panel-copy">
              <h2>New task</h2>
              <p>New tasks start as Todo. Change the status on the card.</p>
            </div>
            <Input
              id="task-title"
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              error={fieldErrors.title}
              maxLength={LIMITS.taskTitle.max}
            />
            <TextArea
              id="task-description"
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              error={fieldErrors.description}
              maxLength={LIMITS.taskDescription.max}
            />
            <Button type="submit" loading={creating}>
              Add task
            </Button>
          </form>

          <div className="board">
            {TASK_STATUSES.map((status) => {
              const columnTasks = tasks.filter(
                (task) => task.status === status.value,
              );
              return (
                <section
                  key={status.value}
                  className={`column column-${status.value}`}
                >
                  <header>
                    <h2>{status.label}</h2>
                    <span>{columnTasks.length}</span>
                  </header>
                  {columnTasks.length === 0 ? (
                    <p className="column-empty">Nothing here.</p>
                  ) : null}
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      busy={busyTaskId === task.id}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </section>
              );
            })}
          </div>
        </>
      ) : null}
    </Layout>
  );
}
