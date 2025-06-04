// src/app/ssr/page.tsx
export default async function SSRPage() {
  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold">🚀 Server-Side Rendering</h2>
      <p>This page will demo SSR, SSG, and ISR.</p>
    </main>
  );
}
