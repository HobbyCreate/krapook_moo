
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


export function getMonthlyPocketSpending(transactions: Transactions[], year: number, month: number) {
    const filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return (
            transactionDate.getFullYear() === year && 
            transactionDate.getMonth()+1 === month &&
            transaction.type === 'OUTCOME'
        );
    });

    const grouped = filtered.reduce((acc, curr) => {
        const key = curr.pocketName || 'กระเป๋าอื่นๆ';
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += Math.abs(curr.amount);
        return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map(key => ({
        label: key,
        value: grouped[key],
    }));
}
