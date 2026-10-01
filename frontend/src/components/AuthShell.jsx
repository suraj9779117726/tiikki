export function AuthShell({ title, lede, children, footer }) {
  return (
    <main className="auth-screen">
      <section className="auth-pitch">
        <p className="brand">Tekki</p>
        <h1>Projects, tasks, and a clear status.</h1>
        <p>An internal board for work you actually intend to finish.</p>
        <ul>
          <li>Create a project</li>
          <li>Add tasks inside it</li>
          <li>Move each task from Todo to Done</li>
        </ul>
      </section>
      <section className="auth-card">
        <h2>{title}</h2>
        <p className="lede">{lede}</p>
        {children}
        <div className="auth-switch">{footer}</div>
      </section>
    </main>
  );
}
