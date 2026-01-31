"use client"

import Link from "next/link"
import Image from "next/image"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function Home() {
  const { t } = useLanguage()
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative h-64 w-full max-w-2xl overflow-hidden rounded-2xl">
            <Image
              src="/images/tres-comas.png"
              alt="Tres Comas - Three bulls with sombreros"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t.home.welcome} <span className="text-primary">TC Sports</span>
            </h1>
            <p className="max-w-xl text-pretty text-lg text-muted-foreground">
              {t.home.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[160px]">
              <Link href="/register">{t.home.getStarted}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px] bg-transparent">
              <Link href="/live-feed">{t.home.browseArticles}</Link>
            </Button>
          </div>

          <div className="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-3">
            <FeatureCard
              title={t.home.features.personalized}
              description={t.home.features.personalizedDesc}
            />
            <FeatureCard
              title={t.home.features.liveUpdates}
              description={t.home.features.liveUpdatesDesc}
            />
            <FeatureCard
              title={t.home.features.archive}
              description={t.home.features.archiveDesc}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50">
      <h3 className="mb-2 text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
