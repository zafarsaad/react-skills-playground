import RestExample from "@/components/RestDemo";
import GraphQLDemo from "@/components/GraphQLDemo";
import RecentRequests from "@/components/RecentRequests";

export default function NetworkPage() {
  return (
    <main className="p-6 space-y-8">
      <h2 className="text-xl font-semibold">🌐 Network Requests</h2>
      <p>This page will demo REST and GraphQL calls.</p>

      <section>
        <h3 className="text-xl font-semibold">REST Example</h3>
        <RestExample />
      </section>
      <section>
        <h3 className="text-xl font-semibold">GraphQL Example</h3>
        <GraphQLDemo />
      </section>
      <section>
        <h3 className="text-xl font-semibold">Recent Requests</h3>
        <RecentRequests />
      </section>
    </main>
  );
}
