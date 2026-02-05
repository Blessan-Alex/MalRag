import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatCard({
  title,
  value,
}: {
  title: string
  value: number | string
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl md:text-4xl font-medium">{value}</div>
      </CardContent>
    </Card>
  )
}
