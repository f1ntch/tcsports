"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Archive, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

// Mock articles data - same as live feed
const allArticles = [
  {
    id: "1",
    title: "Champions League Final: Epic Showdown in Istanbul",
    summary: "Two European giants clash in what promises to be one of the most exciting finals in recent memory. Both teams have shown exceptional form throughout the tournament.",
    createdAt: "2026-01-30T20:30:00Z",
    sport: { id: "1", nameKey: "football" },
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
  },
  {
    id: "2",
    title: "NBA All-Star Weekend: Records Shattered",
    summary: "The annual showcase of basketball's finest talents delivered unforgettable moments with multiple records broken during the three-point contest and slam dunk competition.",
    createdAt: "2026-01-30T18:15:00Z",
    sport: { id: "2", nameKey: "basketball" },
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
  },
  {
    id: "3",
    title: "Australian Open: Underdog Reaches Semi-Finals",
    summary: "In a stunning upset, the unseeded player from Argentina defeats the world number two in straight sets, continuing their fairytale run at Melbourne Park.",
    createdAt: "2026-01-30T14:45:00Z",
    sport: { id: "3", nameKey: "tennis" },
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
  },
  {
    id: "4",
    title: "Tour de France Route Announced for 2026",
    summary: "The legendary race will feature more mountain stages than ever before, with organizers promising the most challenging route in the event's 123-year history.",
    createdAt: "2026-01-30T12:00:00Z",
    sport: { id: "4", nameKey: "cycling" },
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
  },
  {
    id: "5",
    title: "Swimming World Championships: New World Record Set",
    summary: "The 100m freestyle record that stood for over a decade has finally been broken by the rising star from the Netherlands in a breathtaking final.",
    createdAt: "2026-01-29T22:30:00Z",
    sport: { id: "5", nameKey: "swimming" },
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
  },
  {
    id: "6",
    title: "F1 Pre-Season Testing: Surprising Early Pace",
    summary: "The newly restructured team shows unexpected speed during the first week of testing in Bahrain, raising eyebrows across the paddock ahead of the season opener.",
    createdAt: "2026-01-29T19:00:00Z",
    sport: { id: "6", nameKey: "formula1" },
    imageUrl: "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800&q=80",
  },
  {
    id: "7",
    title: "Golf Masters: Tiger Woods Confirms Participation",
    summary: "The legendary golfer has officially confirmed he will compete at Augusta National this April, marking his return after a year-long injury layoff.",
    createdAt: "2026-01-29T16:20:00Z",
    sport: { id: "7", nameKey: "golf" },
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
  },
  {
    id: "8",
    title: "Rugby Six Nations: Ireland vs France Preview",
    summary: "The top two ranked teams in the world prepare for a crucial clash that could determine the championship outcome. Both squads are at full strength.",
    createdAt: "2026-01-29T11:00:00Z",
    sport: { id: "8", nameKey: "rugby" },
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
  },
]

// Mock archived article IDs with archive timestamp - in production this would come from user_archived_articles table
const initialArchivedArticles = [
  { articleId: "2", archivedAt: "2026-01-31T10:30:00Z" },
  { articleId: "5", archivedAt: "2026-01-31T09:15:00Z" },
  { articleId: "3", archivedAt: "2026-01-30T22:00:00Z" },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function ArchivePage() {
  const { t } = useLanguage()
  const [archivedArticles, setArchivedArticles] = useState(initialArchivedArticles)

  const getSportName = (nameKey: string) => {
    return t.sports[nameKey as keyof typeof t.sports] || nameKey
  }

  // Get archived articles sorted by archive date (newest first)
  const sortedArchivedArticles = archivedArticles
    .sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime())
    .map((archived) => {
      const article = allArticles.find((a) => a.id === archived.articleId)
      return article ? { ...article, archivedAt: archived.archivedAt } : null
    })
    .filter(Boolean) as (typeof allArticles[0] & { archivedAt: string })[]

  const handleRemoveFromArchive = (articleId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In production, this would delete from user_archived_articles table in Supabase
    setArchivedArticles(archivedArticles.filter((a) => a.articleId !== articleId))
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Archive className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t.archive.title}</h1>
          </div>
          <p className="text-muted-foreground">
            {t.archive.subtitle}
          </p>
        </div>

        {sortedArchivedArticles.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Archive className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">{t.archive.emptyTitle}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t.archive.emptyDesc}
              </p>
              <Button asChild>
                <Link href="/live-feed">{t.archive.browseFeed}</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {sortedArchivedArticles.length} article{sortedArchivedArticles.length !== 1 ? "s" : ""}
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedArchivedArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          {getSportName(article.sport.nameKey)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">
                          {getRelativeTime(article.createdAt)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(article.createdAt)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleRemoveFromArchive(article.id, e)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t.archive.remove}
                        </Button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {t.archive.archivedOn} {formatDate(article.archivedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
