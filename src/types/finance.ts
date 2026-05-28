export type Category =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Utilities'
  | 'Rent'
  | 'Savings'

export interface Transaction {
  id: string
  date: string // ISO string
  description: string
  amount: number // negative = expense, positive = income
  category: Category
  merchant: string
}

export interface CategorySummary {
  category: Category
  total: number
  percentage: number
  transactionCount: number
  delta: number // % change vs previous month
  budgetLimit: number
  budgetUsed: number // percentage of budget consumed
}

export interface MonthSummary {
  month: string // format: "2024-01"
  totalSpent: number
  totalIncome: number
  savingsRate: number
  topCategory: Category
  categories: CategorySummary[]
}

export interface Budget {
  category: Category
  limit: number
}

export interface DashboardState {
  activeMonth: string
  activeCategoryFilter: Category | null
}
