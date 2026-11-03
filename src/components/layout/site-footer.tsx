import Link from "next/link"
import { DATASET } from "@/lib/model-info"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Pengenalan Bahasa Isyarat Alfabet dari Citra Tangan Menggunakan CNN.</p>
        <p>
          Dataset:{" "}
          <Link href={DATASET.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
            {DATASET.name}
          </Link>
        </p>
      </div>
    </footer>
  )
}
