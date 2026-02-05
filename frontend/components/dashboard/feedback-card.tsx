"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function FeedbackCard() {
  const [rating, setRating] = useState<number>(4)
  const [hover, setHover] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")

  const stars = [1, 2, 3, 4, 5]

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Feedback</CardTitle>
        <div className="flex items-center gap-1" aria-label="Star rating">
          {stars.map((s) => {
            const active = (hover ?? rating) >= s
            return (
              <button
                key={s}
                type="button"
                className="p-1"
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(s)}
                aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
              >
                <Star className={`h-5 w-5 ${active ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Feedback can be written here"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-28"
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="default"
            onClick={() => console.log("[v0] Submitted feedback:", { rating, feedback })}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
