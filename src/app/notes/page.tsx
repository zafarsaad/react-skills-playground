// src/app/notes/page.tsx
import ClientSideName from "@/components/ClientSideName";
import ClientSideImage from "@/components/ClientSideImage";
import ServerSideName from "@/components/server/ServerSideName";

const NotesPage = () => {
  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold">📝 Notes & Journal</h2>
      <p>This page will include a markdown or plain text editor.</p>
      <ClientSideName />
      <ClientSideImage />
      <ServerSideName pokemonName="pikachu" />
    </main>
  );
};

export default NotesPage;
