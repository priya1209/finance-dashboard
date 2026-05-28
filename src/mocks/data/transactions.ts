import { faker } from '@faker-js/faker'
import { Transaction, Category } from '@/types/finance'
import { CATEGORY_MERCHANTS } from '@/lib/constants'

export function generateTransactionsForMonth(month: string): Transaction[] {
  const transactions: Transaction[] = []
  const startDate = new Date(month + '-01')
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
  const daysInMonth = endDate.getDate()

  // Generate 60 transactions per month
  for (let i = 0; i < 60; i++) {
    const category = faker.helpers.arrayElement(Object.keys(CATEGORY_MERCHANTS) as Category[])
    const merchants = CATEGORY_MERCHANTS[category]
    const merchant = faker.helpers.arrayElement(merchants)
    
    // Generate realistic amounts based on category
    let amount = 0
    switch (category) {
      case 'Food & Dining':
        amount = faker.number.int({ min: 50, max: 2000 })
        break
      case 'Transport':
        amount = faker.number.int({ min: 50, max: 1500 })
        break
      case 'Shopping':
        amount = faker.number.int({ min: 200, max: 8000 })
        break
      case 'Entertainment':
        amount = faker.number.int({ min: 99, max: 1500 })
        break
      case 'Health':
        amount = faker.number.int({ min: 100, max: 5000 })
        break
      case 'Utilities':
        amount = faker.number.int({ min: 200, max: 2000 })
        break
      case 'Rent':
        amount = faker.number.int({ min: 15000, max: 35000 })
        break
      case 'Savings':
        amount = faker.number.int({ min: 5000, max: 30000 })
        break
      default:
        amount = faker.number.int({ min: 50, max: 5000 })
    }

    // Make expenses negative, savings positive
    if (category === 'Savings') {
      amount = Math.abs(amount)
    } else {
      amount = -Math.abs(amount)
    }

    const transaction: Transaction = {
      id: faker.string.uuid(),
      date: faker.date.between({ 
        from: startDate, 
        to: endDate 
      }).toISOString(),
      description: faker.helpers.arrayElement([
        `${merchant} Purchase`,
        `${merchant} Payment`,
        `${merchant} Transaction`,
        `${merchant} Bill`,
        `${merchant} Subscription`,
        `${merchant} Order`,
        `${merchant} Booking`,
        `${merchant} Transfer`,
      ]),
      amount,
      category,
      merchant,
    }

    transactions.push(transaction)
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function generateTransactionsForLast6Months(): Record<string, Transaction[]> {
  const result: Record<string, Transaction[]> = {}
  const currentDate = new Date()

  for (let i = 0; i < 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthKey = date.toISOString().slice(0, 7) // Format: "2024-01"
    result[monthKey] = generateTransactionsForMonth(monthKey)
  }

  return result
}

export const ALL_TRANSACTIONS = generateTransactionsForLast6Months()
