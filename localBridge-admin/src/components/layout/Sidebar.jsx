function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#153E46] text-white p-6">
      <h1 className="text-2xl font-bold">
        LocalBridge
      </h1>

      <p className="text-xs text-gray-300 mt-1">
        ADMIN PORTAL
      </p>

      <nav className="mt-5">
        <ul className="space-y-1">

          <li className="bg-[#116B72] p-3 rounded-lg">
            Overview
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Users
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Businesses
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Provider Applications
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Opportunities
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Quotations
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Reports
          </li>

          <li className="p-1 hover:bg-[#116B72] rounded-lg cursor-pointer">
            Settings
          </li>

        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar