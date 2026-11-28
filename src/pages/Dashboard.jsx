import { Users, Building2, Briefcase, FileText, ClipboardCheck } from 'lucide-react'
import Card from '../components/dashboard/Card'
import RecentActivity from '../components/dashboard/RecentActivity'
import { ErrorBox, Skeleton } from '../components/ui/StateViews'
import { useAuth, useStats } from '../context/appContext'

function Dashboard() {
  const { user } = useAuth()
  const { stats, error, reloadStats } = useStats()
  const first = user?.name?.split(' ')[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-900">
          Welcome{first ? `, ${first}` : ''}
        </h2>
        <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening on LocalBridge.</p>
      </div>

      {error && !stats ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <ErrorBox error={error} onRetry={reloadStats} />
        </div>
      ) : !stats ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <Skeleton rows={2} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <Card
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            percentage={`+${stats.newUsers30d} this month`}
            color="aqua"
            trend="up"
            icon={Users}
            to="/users"
          />
          <Card
            title="Businesses"
            value={stats.businesses.toLocaleString()}
            percentage="Active"
            color="blue"
            trend="up"
            icon={Building2}
            to="/businesses"
          />
          <Card
            title="Open Opportunities"
            value={stats.openOpportunities.toLocaleString()}
            percentage={`of ${stats.totalOpportunities}`}
            color="orange"
            trend="up"
            icon={Briefcase}
            to="/opportunities"
          />
          <Card
            title="Quotations"
            value={stats.quotes.toLocaleString()}
            percentage={`${stats.acceptedQuotes} accepted`}
            color="purple"
            trend="up"
            icon={FileText}
            to="/quotations"
          />
          <Card
            title="Pending Applications"
            value={stats.pendingApplications.toLocaleString()}
            percentage="Needs review"
            color="green"
            trend="up"
            icon={ClipboardCheck}
            to="/applications"
            className="col-span-2 lg:col-span-1"
          />
        </div>
      )}

      <RecentActivity />
    </div>
  )
}

export default Dashboard
