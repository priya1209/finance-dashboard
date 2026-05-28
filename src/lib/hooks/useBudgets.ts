import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Budget, Category } from '@/types/finance'

export function useBudgets() {
  const queryClient = useQueryClient()

  const { data: budgets = [], isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await fetch('/api/budgets')
      if (!response.ok) {
        throw new Error('Failed to fetch budgets')
      }
      return response.json() as Promise<Budget[]>
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const updateBudgetMutation = useMutation({
    mutationFn: async ({ category, limit }: { category: Category; limit: number }) => {
      const response = await fetch(`/api/budgets/${encodeURIComponent(category)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      })

      if (!response.ok) {
        throw new Error('Failed to update budget')
      }

      return response.json() as Promise<Budget>
    },
    onMutate: async ({ category, limit }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['budgets'] })

      // Snapshot the previous value
      const previousBudgets = queryClient.getQueryData<Budget[]>(['budgets'])

      // Optimistically update to the new value
      queryClient.setQueryData<Budget[]>(['budgets'], (old = []) =>
        old.map(budget =>
          budget.category === category ? { ...budget, limit } : budget
        )
      )

      // Return a context object with the snapshotted value
      return { previousBudgets }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBudgets) {
        queryClient.setQueryData(['budgets'], context.previousBudgets)
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })

  return {
    budgets,
    isLoading,
    error,
    updateBudget: updateBudgetMutation.mutate,
    isUpdating: updateBudgetMutation.isPending,
  }
}
