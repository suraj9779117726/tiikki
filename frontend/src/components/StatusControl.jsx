import { TASK_STATUSES } from '../constants/status';

export function StatusControl({ value, onChange, disabled = false }) {
  return (
    <div className="status-control" role="group" aria-label="Task status">
      {TASK_STATUSES.map((status) => {
        const active = value === status.value;
        return (
          <button
            key={status.value}
            type="button"
            className={
              active
                ? `status-option is-active is-${status.value}`
                : 'status-option'
            }
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(status.value)}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
