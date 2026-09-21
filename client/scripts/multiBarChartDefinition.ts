import { defineChart, barY, group } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { MonthlyComparisonData } from '@/util/multiBarChartUtil'

export function createIncomeExpenseMultibarChart(
    data: MonthlyComparisonData[]
) {
    const flattenedData = data.flatMap((item) => [
        {
            month: item.month,
            type: 'รายรับ',
            amount: item.income,
        },
        {
            month: item.month,
            type: 'รายจ่าย',
            amount: item.expense,
        },
    ])

    return defineChart({
        margin: { top: 10, right: 10, bottom: 20, left: 40 },
        scales: {
            x: {
                scale: scaleBand,
                padding: 0.4,
            },

            y: {
                scale: scaleLinear,
                nice: true,
                grid: true,
            },
        },

        marks: [
            barY(flattenedData, {
                x: 'month',
                y: 'amount',
                z: 'type',

                fill: (d) =>
                    d.type === 'รายรับ'
                        ? '#10b981'
                        : '#ef4444',

                radius: 4,

                layout: group({
                    padding: 0.2,
                }),
            }),
        ],

        focus: 'group-x',

        tooltip: {
            use: tooltip,
        },
    })
}