export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  ...rest
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  rows = 3,
  ...rest
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
