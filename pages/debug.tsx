export default function Debug() {
  return (
    <div style={{ padding: '50px', fontFamily: 'monospace' }}>
      <h1 style={{ color: 'red' }}>DEBUG PAGE</h1>
      <p>URL: /debug</p>
      <p>If you see this → routing is working!</p>
      <a href="/">← Back to Home</a>
    </div>
  );
}