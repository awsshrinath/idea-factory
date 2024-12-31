import { Sidebar } from "@/components/Sidebar";

export function Settings() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-bold">Settings</h1>
      </main>
    </div>
  );
}