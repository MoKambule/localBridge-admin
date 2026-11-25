
import Sidebar from './components/layout/Sidebar'
import Card from './components/dashboard/Card'

function App() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 min-w-0 bg-[#F8F7F3]">

        {/* Top Navbar */}
        <header className="w-full h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200">

          <div>
            <h1 className="text-lg font-bold text-[#153E46]">
              Welcome to LocalBridge
            </h1>
            <p className="text-gray-500 text-xs">
              Here's what's happening with your platform today.
            </p>
          </div>
          {/* Search Bar */}
          <div className="w-50">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300
                         bg-[#F8F7F3] outline-none
                         focus:border-[#116B72] focus:ring-2 focus:ring-[#116B72]/20"
            />
          </div>

        </header>

        {/* Dashboard Content */}
        <div className="p-8">

          {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3 mt-2">

            <Card title="Total Users" value="-" />
            <Card title="Total Businesses" value="-" />
            <Card title="Total Opportunities" value="-" />
            <Card title="Total Quotations" value="-" />
            <Card title="Pending Applications" value="-" />

          </div>

        </div>

      </main>

    </div>
  )
}

export default App
