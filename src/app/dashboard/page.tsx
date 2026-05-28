'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { DonutChart } from '@/components/charts/DonutChart'

export default function DashboardPage() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Personal Finance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your spending and manage your budget
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut Chart Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Spending by Category
                </h2>
                <DonutChart className="h-80" />
              </div>
            </div>

            {/* Overview Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Total Spent
                  </h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₹0
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This month
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Total Income
                  </h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹0
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This month
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Savings Rate
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    0%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This month
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Top Category
                  </h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    -
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Transactions
              </h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Loading transactions...
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}
