import { Budget, Category } from '@/types/finance'
import { BUDGET_LIMITS } from '@/lib/constants'

export const BUDGETS: Budget[] = Object.entries(BUDGET_LIMITS).map(([category, limit]) => ({
  category: category as Category,
  limit,
}))

export function getBudgetForCategory(category: Category): Budget | undefined {
  return BUDGETS.find(budget => budget.category === category)
}

export function updateBudgetLimit(category: Category, newLimit: number): Budget {
  const budgetIndex = BUDGETS.findIndex(budget => budget.category === category)
  if (budgetIndex !== -1) {
    BUDGETS[budgetIndex].limit = newLimit
  }
  return BUDGETS[budgetIndex]
}
