export default function Topbar() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Good Evening, Abdul
        </h2>
        <p className="text-sm text-zinc-400">
          Your Executive Brain Officer is ready.
        </p>
      </div>

      <div className="text-zinc-300">
        Search • Notifications • Profile
      </div>
    </header>
  );
}