// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Multi-Micro SaaS
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Automate your workflows with our template-based platform. 
          Start with Async Standups and scale with more templates.
        </p>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/templates" 
            className="bg-white text-blue-500 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </div>
  )
}