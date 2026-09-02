'use client'
import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-6">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            <Link href="/">TodoApp</Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/todos"
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Try demo
            </Link>
            <Link
              href="/todos"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Open tasks
            </Link>
          </div>
        </nav>

        <div className="mt-20 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 py-8">
            Organize Your Life
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A frontend demo for creating, filtering, and sorting tasks. No account needed. Tasks reset when you reload.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Simple & Clean',
              description: 'Focus on what matters with our minimalist design.',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ),
            },
            {
              title: 'Stay Organized',
              description: 'Keep track of your tasks with our powerful organization tools.',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              title: 'Try It Freely',
              description: 'Try the task workflow without signing up. Data stays in this session.',
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-500 dark:text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>


        <div className="mt-16 pb-20 text-center">
          <Link
            href="/todos"
            className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
