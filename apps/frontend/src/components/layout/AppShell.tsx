import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatusBar from "./StatusBar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-[#05070D]">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>

        <StatusBar />
      </div>
    </div>
  );
}