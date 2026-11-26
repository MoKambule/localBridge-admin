
import { useState } from 'react'

const applications = [
  {
    id: 1,
    name: 'Naledi Khumalo',
    business: 'Naledi Catering',
    type: 'Sole Proprietor',
    email: 'naledi@example.com',
    date: '25 Nov 2026',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Thabo Mokoena',
    business: 'Mokoena Construction',
    type: 'Registered Company',
    email: 'thabo@example.com',
    date: '24 Nov 2026',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Sipho Dlamini',
    business: 'Dlamini Electrical',
    type: 'Sole Proprietor',
    email: 'sipho@example.com',
    date: '23 Nov 2026',
    status: 'Approved'
  }
]

function Applications() {
    const [selectedApplication, setSelectedApplication] = useState(null)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-lg font-bold text-[#153E46] mb-4">
        Provider Applications
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Account Type</th>
              <th className="px-4 py-3">Date Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.id}
                    onClick={() => setSelectedApplication(application)}
                    className="border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                    >
                <td className="px-4 py-4 font-medium text-[#153E46]">
                  {application.name}
                  <p className="text-xs text-gray-500">
                    {application.email}
                  </p>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {application.business}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {application.type}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {application.date}
                </td>
                <td className="px-4 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                    {application.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Applications
