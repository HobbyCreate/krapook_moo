import { defineChart, lineY, type ChartPoint  } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip'

export interface CumulativeDataPoint {
    month: string;
    cumulative: number;
}

export function createCumulativeLineChart(chartData: CumulativeDataPoint[], lineColor: string) {
    return defineChart({
        scales: {
            x: { scale: scaleBand },
            y: { scale: scaleLinear, nice: true, grid: true },
        },
        marks: [
            lineY(chartData, {
                x: (d: CumulativeDataPoint) => d.month,
                y: (d: CumulativeDataPoint) => d.cumulative,
                stroke: lineColor,
                key: (d: CumulativeDataPoint) => d.month,
            }),
        ],
    },
    {
        tooltip: {
            use: tooltip,
            className: 'sc-chart-tooltip',
            anchor: 'group-center',
            placement: 'auto',
            sort: 'color-domain',
            content: (points) => shadcnTooltipContent(points),
        },
    });
}

function titleCase(value: string) {
    return 'สะสม';
}

function shadcnTooltipContent<TDatum>(points: readonly ChartPoint<TDatum>[]) {
    return {
        title: String(points[0]?.xValue ?? ''),
        rows: points.map((point) => ({
        label: titleCase(
            String(
            point.group ??
                point.markId.replace(
                /-?(bars|lines|areas|slices|values|radar)$/u,
                '',
                ),
            ),
        ),
        value: Number(point.yValue ?? point.xValue ?? 0).toLocaleString('en-US'),
        color: point.color,
        })),
    }
}