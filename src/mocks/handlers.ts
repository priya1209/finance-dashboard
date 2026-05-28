import { http, HttpResponse } from 'msw'
import { ALL_TRANSACTIONS } from './data/transactions'
import { BUDGETS, updateBudgetLimit } from './data/budgets'
import { Category } from '@/types/finance'

export const handlers = [
  // Get transactions for a specific month
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url)
    const month = url.searchParams.get('month')

    if (!month) {
      return HttpResponse.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      )
    }

    const transactions = ALL_TRANSACTIONS[month] || []
    return HttpResponse.json(transactions)
  }),

  // Get all transactions (for overview)
  http.get('/api/transactions/all', () => {
    const allTransactions = Object.values(ALL_TRANSACTIONS).flat()
    return HttpResponse.json(allTransactions)
  }),

  // Get budgets
  http.get('/api/budgets', () => {
    return HttpResponse.json(BUDGETS)
  }),

  // Update budget limit
  http.patch('/api/budgets/:category', async ({ request, params }) => {
    const category = params.category as Category
    const body = await request.json() as { limit: number }

    if (!body.limit || body.limit < 0) {
      return HttpResponse.json(
        { error: 'Valid limit is required' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        { error: 'Failed to update budget' },
        { status: 500 }
      )
    }

    const updatedBudget = updateBudgetLimit(category, body.limit)
    return HttpResponse.json(updatedBudget)
  }),

  // Get month summary
  http.get('/api/summary/:month', ({ params }) => {
    const month = params.month as string
    const transactions = ALL_TRANSACTIONS[month] || []

    const totalSpent = transactions
      .filter((t: any) => t.amount < 0)
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)

    const totalIncome = transactions
      .filter((t: any) => t.amount > 0)
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0

    // Calculate category totals
    const categoryTotals = transactions.reduce((acc: any, transaction: any) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          total: 0,
          count: 0,
        }
      }
      acc[transaction.category].total += Math.abs(transaction.amount)
      acc[transaction.category].count += 1
      return acc
    }, {} as Record<Category, { total: number; count: number }>)

    // Find top category
    const topCategoryEntry = Object.entries(categoryTotals).reduce((a: any, b: any) =>
      a[1].total > b[1].total ? a : b
    )
    const topCategory = topCategoryEntry[0] as Category

    return HttpResponse.json({
      month,
      totalSpent,
      totalIncome,
      savingsRate,
      topCategory,
    })
  }),
]
