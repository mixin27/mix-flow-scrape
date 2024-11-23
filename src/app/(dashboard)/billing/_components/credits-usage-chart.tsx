'use client';

import { ChartColumnIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
    label: 'Successfull Phases Credits',
    color: 'hsl(var(--chart-2))',
  },
  failed: {
    label: 'Failed Phases Credits',
    color: 'hsl(var(--chart-1))',
  },
};

export default function CreditsUsageChart({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ChartColumnIcon className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
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
            <Bar
              dataKey={'success'}
              fill="var(--color-success)"
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              stroke="var(--color-success)"
              stackId="a"
            />
            <Bar
              dataKey={'failed'}
              fill="var(--color-failed)"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              stroke="var(--color-failed)"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
