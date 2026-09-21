import { defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { tooltip as exampleTooltip } from '@tanstack/charts/tooltip'
import { generatePaletteFromSingleColor } from '@/util/util'

export interface PocketChartItem {
    label: string;
    value: number;
}

export const createUsageDonutChart = (data: PocketChartItem[], baseColor = '#0ea5e9') => {
    const arcs = pie(data, {
        value: 'value',
    })

    const chartColors = generatePaletteFromSingleColor(baseColor, data.length);

    return defineChart(
        {
            marks: [
                polar({
                    inset: 0,
                    radiusRatio: 0.8,
                    marks: [
                        radialArc(arcs, {
                            id: 'pocket-slices',
                            key: 'label', 
                            innerRadius: ({ radius }) => radius * 0.6, 
                            color: 'label',
                        }),
                    ],
                    scales: {
                        angle: null,
                        radius: null,
                    },
                }),
            ],
            scales: {
                x: null,
                y: null,
            },
            color: { range: chartColors },
            margin: 0,
        },
        {
            keyboard: true,
            tooltip: {
                use: exampleTooltip,
                format: ({ datum }) =>
                    `กระเป๋า ${datum.label} : ${datum.value.toLocaleString()} THB`, 
            },
        },
    )
}