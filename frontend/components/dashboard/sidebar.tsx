"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "w-64 shrink-0 bg-sidebar text-sidebar-foreground p-4 md:p-6 border-r flex flex-col items-center gap-6",
        className,
      )}
      aria-label="User navigation"
    >
      <div className="mt-2" />
      <Avatar className="h-28 w-28">
        <AvatarFallback className="text-xl">BA</AvatarFallback>
      </Avatar>

      <div className="w-full">
        <button
          type="button"
          className="w-full rounded-md border bg-secondary text-secondary-foreground py-3 px-4 text-lg"
        >
          Blessan Alex
        </button>
      </div>
    </aside>
  )
}
