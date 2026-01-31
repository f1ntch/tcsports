"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"

// Mock articles data - in production this would come from Supabase
const mockArticles = [
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

// Mock user interests - in production this would come from user_interests table in Supabase
const mockUserInterests = ["1", "2", "6"] // Football, Basketball, Formula 1

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
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function LiveFeedPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")

  const sports = [
    { id: "all", name: t.liveFeed.allSports },
    { id: "my-interests", name: t.liveFeed.myInterests },
    { id: "1", name: t.sports.football },
    { id: "2", name: t.sports.basketball },
    { id: "3", name: t.sports.tennis },
    { id: "4", name: t.sports.cycling },
    { id: "5", name: t.sports.swimming },
    { id: "6", name: t.sports.formula1 },
    { id: "7", name: t.sports.golf },
    { id: "8", name: t.sports.rugby },
  ]

  const getSportName = (nameKey: string) => {
    return t.sports[nameKey as keyof typeof t.sports] || nameKey
  }

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesSport = false
    if (selectedSport === "all") {
      matchesSport = true
    } else if (selectedSport === "my-interests") {
      matchesSport = mockUserInterests.includes(article.sport.id)
    } else {
      matchesSport = article.sport.id === selectedSport
    }
    
    return matchesSearch && matchesSport
  })

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t.liveFeed.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.liveFeed.subtitle}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.liveFeed.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <Badge
                      variant="secondary"
                      className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm"
                    >
                      {getSportName(article.sport.nameKey)}
                    </Badge>
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                        {getRelativeTime(article.createdAt)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                      {article.title}
                    </h2>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(article.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">{t.liveFeed.noArticles}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.liveFeed.noArticlesDesc}
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedSport("all")
              }}
            >
              {t.liveFeed.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
