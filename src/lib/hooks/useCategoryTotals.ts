import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { CategorySummary, Category, Transaction } from '@/types/finance'
import { useDashboardStore } from '@/lib/store/dashboard'
import { BUDGET_LIMITS } from '@/lib/constants'

interface CategoryTotalsResult {
  categories: CategorySummary[]
  isLoading: boolean
  error: Error | null
}

// Helper function to generate consistent mock delta
function getMockDelta(category: Category): number {
  const deltas: Record<Category, number> = {
    'Food & Dining': 12.5,
    'Transport': -8.3,
    'Shopping': 15.7,
    'Entertainment': -5.2,
    'Health': 3.8,
    'Utilities': -2.1,
    'Rent': 0,
    'Savings': 8.9,
  }
  return deltas[category]
}

export function useCategoryTotals(): CategoryTotalsResult {
  const { activeMonth } = useDashboardStore()

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', activeMonth],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?month=${activeMonth}`)
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      return response.json() as Promise<Transaction[]>
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const categories = useMemo(() => {
    // Group transactions by category
    const categoryGroups = transactions.reduce((acc: Record<Category, number[]>, transaction: Transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = []
      }
      acc[transaction.category].push(Math.abs(transaction.amount))
      return acc
    }, {} as Record<Category, number[]>)

    // Calculate totals and percentages
    const totalSpent = Object.values(categoryGroups).flat().reduce((sum: number, amount: number) => sum + amount, 0)

    return Object.entries(categoryGroups).map(([category, amounts]) => {
      const total = (amounts as number[]).reduce((sum: number, amount: number) => sum + amount, 0)
      const budgetLimit = BUDGET_LIMITS[category as Category]
      const budgetUsed = budgetLimit > 0 ? (total / budgetLimit) * 100 : 0

      return {
        category: category as Category,
        total,
        percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
        transactionCount: (amounts as number[]).length,
        delta: getMockDelta(category as Category),
        budgetLimit,
        budgetUsed,
      }
    }).sort((a, b) => b.total - a.total)
  }, [transactions])

  return {
    categories,
    isLoading,
    error,
  }
}
