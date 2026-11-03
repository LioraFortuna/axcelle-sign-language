import Link from "next/link"
import { Hand } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Hand className="size-4.5" />
      </span>
      <span>
        Isyarat<span className="text-primary">CNN</span>
      </span>
    </Link>
  )
}
