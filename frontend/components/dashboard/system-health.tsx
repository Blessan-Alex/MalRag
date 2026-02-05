import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function SystemHealth({ className }: { className?: string }) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-lg">System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 md:h-48 rounded-md border bg-muted" aria-label="System health summary area" />
      </CardContent>
    </Card>
  )
}
