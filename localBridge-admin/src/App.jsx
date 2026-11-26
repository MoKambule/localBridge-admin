
import Sidebar from './components/layout/Sidebar'
import Card from './components/dashboard/Card'
import RecentActivity from './components/dashboard/RecentActivity'
import Applications from './components/provider/Applications'

function App() {
  return (
    <div className="flex min-h-screen overflow-hidden">

      <Sidebar />

      <main className="flex-1 min-w-0 bg-white overflow-hidden">

        {/* Top Navbar */}
        <header className="w-full shrink-0 min-h-16 bg-white flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200">

          <div>
            <h1 className="text-lg font-bold text-[#153E46]">
              Welcome to LocalBridge
            </h1>

            <p className="text-gray-500 text-xs">
              Here's what's happening with your platform today.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-50">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-[#116B72] outline-none text-white focus:border-[#116B72] focus:ring-2 focus:ring-[#116B72]/20"
            />
          </div>

        </header>

        {/* Dashboard Content */}
        <div className="p-3">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-3 mt-2">

            <Card title="Total Users" value="1,250" percentage="+12%" color="aqua" trend="up" />

            <Card title="Total Businesses" value="320" percentage="+8%" color="blue" trend="up" />

            <Card title="Total Opportunities" value="180" percentage="+5%" color="orange" trend="up" />

            <Card title="Total Quotations" value="450" percentage="+10%" color="purple" trend="up" />

            <Card title="Pending Applications" value="24" percentage="-3%" color="green" trend="down" />

          </div>

          {/* Recent Activity Table */}
          <div className="mt-6">
            <RecentActivity />
          </div>
          <div className="mt-6">
            <Applications />
          </div>

        </div>

      </main>
    </div>
  )
}

export default App
