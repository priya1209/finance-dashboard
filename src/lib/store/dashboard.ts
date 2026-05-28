import React from 'react'
import { create } from 'zustand'
import { Category, DashboardState } from '@/types/finance'
import { parseAsString, useQueryState } from 'nuqs'

interface DashboardStore extends DashboardState {
  setMonth: (month: string) => void
  setCategoryFilter: (category: Category | null) => void
}

// URL sync adapters
const monthQuery = parseAsString.withDefault(
  new Date().toISOString().slice(0, 7) // Current month
)

const categoryQuery = parseAsString.withDefault('')

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeMonth: new Date().toISOString().slice(0, 7),
  activeCategoryFilter: null,

  setMonth: (month) => {
    set({ activeMonth: month })
  },

  setCategoryFilter: (category) => {
    set({ activeCategoryFilter: category })
  },
}))

// Hook to sync URL state with store
export function useUrlSync() {
  const { setMonth, setCategoryFilter } = useDashboardStore()

  const [month, setMonthQuery] = useQueryState('month', monthQuery)
  const [category, setCategoryQuery] = useQueryState('category', categoryQuery)

  // Update store when URL changes
  React.useEffect(() => {
    if (month) {
      useDashboardStore.setState({ activeMonth: month })
    }

    if (category) {
      useDashboardStore.setState({ activeCategoryFilter: category as Category })
    } else if (category === '') {
      useDashboardStore.setState({ activeCategoryFilter: null })
    }
  }, [month, category])

  return {
    setMonth: (month: string) => {
      setMonth(month)
      setMonthQuery(month)
    },
    setCategoryFilter: (category: Category | null) => {
      setCategoryFilter(category)
      setCategoryQuery(category || '')
    },
  }
}
