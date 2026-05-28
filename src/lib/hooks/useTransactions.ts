import { useQuery } from '@tanstack/react-query'
import { Transaction, Category } from '@/types/finance'
import { useDashboardStore } from '@/lib/store/dashboard'

interface UseTransactionsResult {
  transactions: Transaction[]
  byCategory: Record<Category, Transaction[]>
  totals: {
    spent: number
    income: number
    savingsRate: number
  }
}

export function useTransactions(): UseTransactionsResult {
  const { activeMonth, activeCategoryFilter } = useDashboardStore()

  const { data: transactions = [] } = useQuery({
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

  // Memoized calculations
  const filteredTransactions = activeCategoryFilter
    ? transactions.filter(t => t.category === activeCategoryFilter)
    : transactions

  const byCategory = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = []
    }
    acc[transaction.category].push(transaction)
    return acc
  }, {} as Record<Category, Transaction[]>)

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount < 0) {
        acc.spent += Math.abs(transaction.amount)
      } else {
        acc.income += transaction.amount
      }
      return acc
    },
    { spent: 0, income: 0, savingsRate: 0 }
  )

  totals.savingsRate = totals.income > 0 
    ? ((totals.income - totals.spent) / totals.income) * 100 
    : 0

  return {
    transactions: filteredTransactions,
    byCategory,
    totals,
  }
}
