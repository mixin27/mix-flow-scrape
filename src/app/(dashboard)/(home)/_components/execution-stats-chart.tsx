'use client';

import { Layers2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { GetWorkflowExecutionStats } from '@/actions/analytics/get-workflow-execution-stats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-2))',
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--chart-1))',
  },
};

export default function ExecutionStatsChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Layers2 className="size-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successful and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={'date'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[200px]" />}
            />
            <Area
              dataKey={'success'}
              min={0}
              type="bump"
              fill="var(--color-success)"
              fillOpacity={0.6}
              stroke="var(--color-success)"
              stackId="a"
            />
            <Area
              dataKey={'failed'}
              min={0}
              type="bump"
              fill="var(--color-failed)"
              fillOpacity={0.6}
              stroke="var(--color-failed)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
