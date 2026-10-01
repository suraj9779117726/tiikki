import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export function ProjectCard({ project }) {
  const progress =
    project.taskCount === 0
      ? 0
      : Math.round((project.doneCount / project.taskCount) * 100);

  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <p className="eyebrow">Updated {formatDate(project.updatedAt)}</p>
      <h2>{project.name}</h2>
      <p className="card-copy">
        {project.description || 'No description yet.'}
      </p>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="project-meta">
        <span>
          {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
        </span>
        <span>{progress}% done</span>
      </div>
    </Link>
  );
}
