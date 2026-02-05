import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = ["efhwdbwhjdvhjwv", "Item two", "Item three", "Item four", "Item five"]

export default function RecentActivity() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span aria-hidden className="mt-1 h-3 w-3 rounded-sm border bg-secondary" />
              <span className="text-sm leading-6">{it}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
