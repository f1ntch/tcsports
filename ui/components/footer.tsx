"use client"

import Image from "next/image"
import { useLanguage } from "./language-provider"

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t.common.poweredBy} DPG Media {t.common.and} Inkubis
          </p>
          <div className="flex items-center gap-6">
            <div className="relative h-8 w-24 rounded bg-white p-1">
              <Image
                src="/images/dpg-media-logo.png"
                alt="DPG Media"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-8 w-28 overflow-hidden rounded bg-secondary p-1 dark:bg-[#1a1035]">
              <Image
                src="/images/inkubis-logo.svg"
                alt="Inkubis"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
