'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useMemo } from 'react'
import { Category } from '@/types/finance'
import { useCategoryTotals } from '@/lib/hooks/useCategoryTotals'
import { useUrlSync } from '@/lib/store/dashboard'
import { CATEGORY_COLOR_MAP } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface DonutChartProps {
  className?: string
}

export function DonutChart({ className = '' }: DonutChartProps) {
  const { categories, isLoading } = useCategoryTotals()
  const { setCategoryFilter } = useUrlSync()

  const chartData = useMemo(() => {
    return categories.map(category => ({
      name: category.category,
      value: category.total,
      color: CATEGORY_COLOR_MAP[category.category],
    }))
  }, [categories])

  const totalSpent = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.total, 0)
  }, [categories])

  const handleChartClick = (data: { name?: string } | undefined) => {
    if (data?.name) {
      setCategoryFilter(data.name as Category)
    }
  }

  if (isLoading) {
    return (
      <div className={`min-h-[300px] flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`relative min-h-[300px] ${className}`}>
      {/* Visually hidden data table for accessibility */}
      <div className="sr-only" role="table" aria-label="Spending by category">
        <div role="row">
          <div role="columnheader">Category</div>
          <div role="columnheader">Amount</div>
        </div>
        {categories.map((category) => (
          <div key={category.category} role="row">
            <div role="cell">{category.category}</div>
            <div role="cell">{formatCurrency(category.total)}</div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            onClick={handleChartClick}
            className="cursor-pointer"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Spent
          </div>
        </div>
      </div>
    </div>
  )
}
