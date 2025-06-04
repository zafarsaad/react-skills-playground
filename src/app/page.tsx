export default function HomePage() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧠 React Skills Playground</h1>
      <ul className="space-y-2">
        <li>
          <a href="/state" className="text-blue-600 hover:underline">
            useState + useReducer & other hooks
          </a>
        </li>
        <li>
          <a href="/network" className="text-blue-600 hover:underline">
            🌐 REST & GraphQL
          </a>
        </li>
        <li>
          <a href="/ssr" className="text-blue-600 hover:underline">
            🚀 Server-Side Rendering
          </a>
        </li>
        <li>
          <a href="/notes" className="text-blue-600 hover:underline">
            📝 Notes/Journal
          </a>
        </li>
        <li>
          <a href="/seating" className="text-blue-600 hover:underline">
            💺 Seating
          </a>
        </li>
      </ul>
    </main>
  );
}
