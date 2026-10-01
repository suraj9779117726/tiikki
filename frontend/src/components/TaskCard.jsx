import { Button } from './Button';
import { StatusControl } from './StatusControl';

export function TaskCard({ task, busy, onStatusChange, onDelete }) {
  return (
    <article className="task-card">
      <h3>{task.title}</h3>
      {task.description ? <p>{task.description}</p> : null}
      <StatusControl
        value={task.status}
        disabled={busy}
        onChange={(status) => onStatusChange(task, status)}
      />
      <Button variant="ghost" disabled={busy} onClick={() => onDelete(task)}>
        Delete
      </Button>
    </article>
  );
}
