const menuItems = [
  "Dashboard",
  "EBO",
  "Missions",
  "Businesses",
  "Knowledge",
  "Automation",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 text-white border-r border-zinc-800 h-screen p-6">
      <h1 className="text-2xl font-bold mb-10 text-cyan-400">
        MBO
      </h1>

      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item}
              className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}