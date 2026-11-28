import { Hammer } from 'lucide-react'

function ComingSoon({ title }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 text-brand-600 flex items-center justify-center">
        <Hammer size={22} />
      </div>
      <h2 className="mt-4 font-bold text-brand-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">This section is being built.</p>
    </div>
  )
}

export default ComingSoon
