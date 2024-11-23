import { LucideIcon } from 'lucide-react';

import ReactCountupWrapper from '@/components/common/react-countup-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export default function StatsCard({ title, value, icon: Icon }: Props) {
  return (
    <Card className="relative h-full overflow-hidden">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="absolute -bottom-4 -right-8 stroke-primary text-muted-foreground opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountupWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
}
