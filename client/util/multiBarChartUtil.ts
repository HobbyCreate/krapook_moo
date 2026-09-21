
export interface Transactions {
    id: string,
    userId: string,
    pocketId: string,
    pocketName: string,
    amount: number,
    deductPocket: number,
    deductMain: number,
    type: string,
    note: string,
    createdAt: string
}

export interface MonthlyComparisonData {
    month: string 
    income: number
    expense: number
}

export function getIncomeExpenseTrendData(transactions: Transactions[], monthsCount: number = 3): MonthlyComparisonData[] {
    const result: { [key: string]: { income: number; expense: number; timestamp: number } } = {}
    
    const now = new Date()
    
    for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
        result[monthKey] = { income: 0, expense: 0, timestamp: d.getTime() }
    }

    transactions.forEach((tx) => {
        const txDate = new Date(tx.createdAt)
        const monthKey = txDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })

        if (result[monthKey]) {
            if (tx.type === 'INCOME') {
                result[monthKey].income += Number(tx.amount)
            } else if (tx.type === 'OUTCOME') {
                const totalExpense = Math.abs(Number(tx.amount)) + Math.abs(Number(tx.deductMain || 0))
                result[monthKey].expense += totalExpense
            }
        }
    })

    return Object.keys(result)
        .sort((a, b) => result[a].timestamp - result[b].timestamp)
        .map((key) => ({
            month: key,
            income: result[key].income,
            expense: result[key].expense,
        }))
}