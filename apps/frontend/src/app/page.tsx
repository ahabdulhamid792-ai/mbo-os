import AppShell from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <h1 className="text-4xl font-bold text-white">
        Welcome to MBO
      </h1>

      <p className="text-zinc-400 mt-4">
        Your AI Business Operating System is now running.
      </p>
    </AppShell>
  );
}