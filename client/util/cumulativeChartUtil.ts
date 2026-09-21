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

export interface MonthlyCumulativeData {
    month: string 
    cumulative: number
}

export function getMonthlyCumulative(transactions: Transactions[], monthsCount: number = 3): MonthlyCumulativeData[] {
    const result: { [key: string]: { cumulative: number; timestamp: number } } = {}
    
    const now = new Date()
    
    // 1. สร้างโครงสร้างข้อมูลตั้งต้นตามจำนวนเดือนย้อนหลัง
    for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
        result[monthKey] = { cumulative: 0, timestamp: d.getTime() }
    }

    // 2. เรียงลำดับธุรกรรมจากอดีต -> ปัจจุบัน เพื่อให้การคำนวณยอดสะสม (Running Total) ถูกต้องตามเวลา
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let runningBalance = 0;

    // 3. วนลูปคำนวณยอดเงินเข้า และหักลบยอดจ่าย (รวมถึงส่วนที่ตัดจาก Balance หลักโดยตรง)
    sortedTransactions.forEach((tx) => {
        const txDate = new Date(tx.createdAt)
        const monthKey = txDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })

        if (result[monthKey]) {
            if (tx.type === 'INCOME') {
                runningBalance += Number(tx.amount);
            } else if (tx.type === 'OUTCOME') {
                // คำนวณรายจ่ายทั้งหมดโดยนำ amount และยอดที่ตัดตรงจาก balance หลัก (deductMain) มาหักออก
                const totalExpense = Math.abs(Number(tx.amount)) + Math.abs(Number(tx.deductMain || 0));
                runningBalance -= totalExpense;
            }
        }

        // อัปเดตยอดสะสมท้ายเดือนนั้นๆ
        if (result[monthKey]) {
            result[monthKey].cumulative = runningBalance;
        }
    });

    // 4. แปลงกลับเป็น Array เรียงตามลำดับเวลาสำหรับส่งให้ Line Chart
    return Object.keys(result)
        .sort((a, b) => result[a].timestamp - result[b].timestamp)
        .map((key) => ({
            month: key,
            cumulative: result[key].cumulative,
        }))
}