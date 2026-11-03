import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  text,
  as: Tag = "h2",
  className,
}: {
  eyebrow: string
  title: string
  text?: string
  as?: "h1" | "h2"
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <Tag className={cn("font-semibold tracking-tight text-balance", Tag === "h1" ? "text-4xl" : "text-3xl")}>
        {title}
      </Tag>
      {text && <p className="text-pretty text-muted-foreground">{text}</p>}
    </div>
  )
}
