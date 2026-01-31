"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, BookmarkCheck, User, Link2, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

// Mock archived articles - in production this would come from Supabase user_archived_articles table
const mockArchivedArticleIds = ["2", "5"]

// Mock articles data with full content and tags - in production this would come from Supabase
const mockArticles = [
  {
    id: "1",
    title: "Champions League Final: Epic Showdown in Istanbul",
    summary: "Two European giants clash in what promises to be one of the most exciting finals in recent memory. Both teams have shown exceptional form throughout the tournament.",
    content: `The stage is set for what many are calling the match of the decade. Two of Europe's most prestigious clubs will face off in Istanbul's Ataturk Olympic Stadium, a venue steeped in Champions League history.

Both teams have navigated a treacherous path to reach this final. The defending champions overcame a dramatic semi-final against last year's runners-up, while their opponents dispatched the tournament favorites with a stunning display of tactical brilliance.

The tactical battle between the two managers promises to be fascinating. One favors a high-pressing, possession-based approach, while the other has mastered the art of the counter-attack. Their previous encounters have produced some memorable moments, and this final is expected to be no different.

Key players on both sides have been in scintillating form. The tournament's top scorer will be looking to add to his tally, while the opposing goalkeeper has kept the most clean sheets in this year's competition.

With millions of fans watching worldwide, the pressure will be immense. But these players thrive on the biggest stages, and we can expect nothing less than a spectacle befitting the world's most prestigious club competition.`,
    createdAt: "2026-01-30T20:30:00Z",
    sport: { id: "1", name: "Football" },
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    author: "James Wilson",
    tags: ["Champions League", "Final", "Istanbul", "European Football", "UEFA"],
  },
  {
    id: "2",
    title: "NBA All-Star Weekend: Records Shattered",
    summary: "The annual showcase of basketball's finest talents delivered unforgettable moments with multiple records broken during the three-point contest and slam dunk competition.",
    content: `The NBA All-Star Weekend delivered on its promise of entertainment, with several records falling across the various competitions held throughout the event.

The Three-Point Contest saw a new benchmark set, with the winner draining an incredible 31 out of 34 attempts in the final round. This shattered the previous record of 29, which had stood for over a decade. The crowd at the arena was on their feet for every shot in the final minute.

The Slam Dunk Competition returned to its glory days with four competitors pushing the boundaries of what's physically possible. The winning dunk, a between-the-legs reverse from the free-throw line, earned a perfect 50 from all judges and sparked immediate debate about whether it was the greatest dunk in contest history.

The All-Star Game itself showcased the league's brightest stars in a surprisingly competitive affair. Unlike recent years where defense was optional, both teams played with intensity throughout, resulting in a thrilling finish decided by a game-winning three-pointer with 2.3 seconds remaining.

Rising stars from the draft class also made their presence felt during the Rising Stars Challenge, with one rookie posting a triple-double performance that announced his arrival on the biggest stage.`,
    createdAt: "2026-01-30T18:15:00Z",
    sport: { id: "2", name: "Basketball" },
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
    author: "Marcus Thompson",
    tags: ["NBA", "All-Star", "Three-Point Contest", "Slam Dunk", "Records"],
  },
  {
    id: "3",
    title: "Australian Open: Underdog Reaches Semi-Finals",
    summary: "In a stunning upset, the unseeded player from Argentina defeats the world number two in straight sets, continuing their fairytale run at Melbourne Park.",
    content: `In one of the most remarkable stories of this year's Australian Open, an unseeded Argentine player has reached the semi-finals after defeating the world number two in straight sets.

The 22-year-old, ranked 87th in the world, produced the performance of his career on Rod Laver Arena. His powerful baseline game and exceptional court coverage proved too much for his highly-favored opponent, who struggled to find his rhythm throughout the match.

Coming into the tournament, few had heard of this rising star outside of South American tennis circles. But his journey through the draw has captured the hearts of Melbourne's passionate tennis fans. From a five-set thriller in the first round to clinical victories in subsequent matches, he has shown he belongs at this level.

The Argentine's semi-final opponent will be another top-ten player, but after this performance, nothing seems impossible. His coach, a former top-20 player himself, has instilled a fearless mentality that is paying dividends on the biggest stages.

Tennis pundits are already drawing comparisons to other great underdog stories in Grand Slam history. Whether or not he can go all the way, this tournament has announced the arrival of a future star.`,
    createdAt: "2026-01-30T14:45:00Z",
    sport: { id: "3", name: "Tennis" },
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
    author: "Sofia Martinez",
    tags: ["Australian Open", "Grand Slam", "Tennis", "Upset", "Argentina"],
  },
  {
    id: "4",
    title: "Tour de France Route Announced for 2026",
    summary: "The legendary race will feature more mountain stages than ever before, with organizers promising the most challenging route in the event's 123-year history.",
    content: `Tour de France organizers have unveiled what they're calling the most demanding route in the race's 123-year history, with a record number of mountain stages set to challenge the world's best cyclists.

The 2026 edition will feature six mountain-top finishes, including back-to-back summit finishes in the Alps during the final week. The infamous Mont Ventoux returns after a two-year absence, scheduled for a crucial stage that could define the entire race.

Perhaps most significantly, the Tour will venture into new territory with a stage finish at altitude in the Pyrenees that has never been used before. Organizers have kept details of this new climb closely guarded, but early reports suggest it will be one of the steepest ascents in Tour history.

The time trial distances have been reduced compared to recent years, favoring pure climbers over all-rounders. This strategic decision is expected to shake up the General Classification battle and could see new faces competing for the yellow jersey in Paris.

Rest days have been positioned to allow riders to recover before the most demanding mountain blocks, but the overall climbing total of over 58,000 meters is unprecedented. Teams are already adapting their training and recruitment strategies in response.`,
    createdAt: "2026-01-30T12:00:00Z",
    sport: { id: "4", name: "Cycling" },
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    author: "Pierre Dubois",
    tags: ["Tour de France", "Cycling", "Mountain Stage", "Alps", "Pyrenees"],
  },
  {
    id: "5",
    title: "Swimming World Championships: New World Record Set",
    summary: "The 100m freestyle record that stood for over a decade has finally been broken by the rising star from the Netherlands in a breathtaking final.",
    content: `The swimming world witnessed history as a 23-year-old from the Netherlands broke the seemingly unbreakable 100m freestyle world record at the World Championships.

The previous record, set over a decade ago during the controversial super-suit era, had long been considered out of reach for swimmers competing in textile suits. Many believed it would stand forever, a relic of a time when technological advantages artificially enhanced performances.

But the young Dutch swimmer had other ideas. From the moment he dove into the pool, it was clear something special was unfolding. His underwater phase off the start was exceptional, and he surfaced in a world-record split at the 50-meter mark.

The second length was where champions are made, and he delivered. Fighting through the lactic acid and maintaining his stroke rate, he touched the wall in a time that sent shockwaves through the aquatics center. The scoreboard confirmed what the roaring crowd already knew - a new world record.

This performance cements his status as the greatest sprinter of his generation and opens up exciting possibilities for relay events at upcoming major championships.`,
    createdAt: "2026-01-29T22:30:00Z",
    sport: { id: "5", name: "Swimming" },
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80",
    author: "Emma van Berg",
    tags: ["Swimming", "World Record", "World Championships", "Netherlands", "Freestyle"],
  },
  {
    id: "6",
    title: "F1 Pre-Season Testing: Surprising Early Pace",
    summary: "The newly restructured team shows unexpected speed during the first week of testing in Bahrain, raising eyebrows across the paddock ahead of the season opener.",
    content: `The first week of Formula 1 pre-season testing in Bahrain has thrown up a major surprise, with one of the sport's traditionally midfield teams showing pace that has caught the attention of the entire paddock.

After a significant restructuring during the off-season, including the arrival of several key technical personnel from championship-winning teams, the improved pace was perhaps not entirely unexpected. But the margins they're showing over established frontrunners have exceeded even the most optimistic predictions.

Lap time analysis reveals their car is particularly strong in the high-speed corners, suggesting their new aerodynamic philosophy is working as intended. The power unit also appears to have made significant gains over the winter, with GPS data showing improved acceleration out of slow corners.

Both drivers have expressed satisfaction with the car's balance and handling characteristics. The team's new recruit, a former world champion, has been particularly impressive, consistently topping the timing sheets across different fuel loads and tire compounds.

Of course, pre-season testing rarely tells the full story. Teams run different programs, fuel loads, and engine modes. But the sustained performance over multiple days suggests this is more than sandbagging by their rivals.`,
    createdAt: "2026-01-29T19:00:00Z",
    sport: { id: "6", name: "Formula 1" },
    imageUrl: "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1200&q=80",
    author: "Sebastian Kraft",
    tags: ["Formula 1", "Pre-Season", "Testing", "Bahrain", "F1 2026"],
  },
  {
    id: "7",
    title: "Golf Masters: Tiger Woods Confirms Participation",
    summary: "The legendary golfer has officially confirmed he will compete at Augusta National this April, marking his return after a year-long injury layoff.",
    content: `Tiger Woods has confirmed he will tee it up at Augusta National this April, ending months of speculation about whether the 15-time major champion would compete at the Masters.

The announcement comes after Woods successfully completed a full practice round at his home course in Florida, walking all 18 holes without any visible discomfort. His team reports that an intensive rehabilitation program over the past six months has restored his leg strength and mobility.

Woods' relationship with Augusta National is the stuff of legend. His five green jackets, including his remarkable 2019 comeback victory, make him one of the most successful players in tournament history. The Georgia pines seem to bring out the best in him.

At 50 years old, Woods acknowledges he's no longer capable of winning every week. But he maintains that major championships, particularly the Masters, remain achievable goals. His course management skills and competitive experience give him advantages that raw physical ability cannot replicate.

Tournament officials have welcomed the news, recognizing the boost Woods' participation brings to television ratings and fan engagement. Augusta National has always celebrated its champions, and few champions have meant more to the tournament than Tiger Woods.`,
    createdAt: "2026-01-29T16:20:00Z",
    sport: { id: "7", name: "Golf" },
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80",
    author: "Robert Johnson",
    tags: ["Golf", "Masters", "Tiger Woods", "Augusta", "Comeback"],
  },
  {
    id: "8",
    title: "Rugby Six Nations: Ireland vs France Preview",
    summary: "The top two ranked teams in the world prepare for a crucial clash that could determine the championship outcome. Both squads are at full strength.",
    content: `The Six Nations reaches a potential championship-deciding moment this weekend as the world's top two ranked teams meet in Dublin. Ireland, defending Grand Slam champions, host a French side determined to end their recent dominance.

Both teams come into this fixture with perfect records, making this effectively a title decider with two rounds still to play. The winner will be overwhelming favorites to claim the championship, while the loser faces a difficult path to the trophy.

Ireland's fortress-like home record makes them marginal favorites, but France possess the attacking firepower to breach any defense. Their backline, featuring multiple world-class talents, has scored more tries than any other team in this year's competition.

The forward battle will be equally compelling. Ireland's lineout and maul have been dominant, while France's scrum has been the most powerful in the tournament. Set-piece execution could ultimately decide the outcome.

Weather forecasts suggest favorable conditions for running rugby, which should suit both teams' expansive playing styles. With the roof of the Aviva Stadium closed, the atmosphere promises to be electric for what many are already calling the game of the championship.`,
    createdAt: "2026-01-29T11:00:00Z",
    sport: { id: "8", name: "Rugby" },
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    author: "Conor O'Brien",
    tags: ["Rugby", "Six Nations", "Ireland", "France", "Championship"],
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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

export default function ArticlePage() {
  const params = useParams()
  const { t } = useLanguage()
  const id = params.id as string
  const article = mockArticles.find((a) => a.id === id)
  
  // Track if article is archived - in production this would check the user_archived_articles table
  const [isArchived, setIsArchived] = useState(mockArchivedArticleIds.includes(id))
  const [linkCopied, setLinkCopied] = useState(false)
  
  const handleArchiveToggle = () => {
    // In production, this would insert/delete from user_archived_articles table in Supabase
    // linking the article ID to the logged-in user's ID
    setIsArchived(!isArchived)
  }
  
  const getArticleUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href
    }
    return ""
  }
  
  const handleCopyLink = async () => {
    const url = getArticleUrl()
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }
  
  const handleShareFacebook = () => {
    const url = encodeURIComponent(getArticleUrl())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400")
  }
  
  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(getArticleUrl())
    const text = encodeURIComponent(article?.title || "Check out this article")
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank")
  }

  if (!article) {
    return (
      <AppLayout>
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
          <h1 className="text-2xl font-bold text-foreground">{t.article.articleNotFound}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.article.articleNotFoundDesc}
          </p>
          <Button asChild className="mt-6">
            <Link href="/live-feed">{t.article.backToFeed}</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  // Get related articles (same sport, excluding current)
  const relatedArticles = mockArticles
    .filter((a) => a.sport.id === article.sport.id && a.id !== article.id)
    .slice(0, 3)

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/live-feed"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.article.backToFeed}
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative mb-6 aspect-video overflow-hidden rounded-xl">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <Badge
                variant="secondary"
                className="absolute left-4 top-4 bg-background/90 backdrop-blur-sm"
              >
                {article.sport.name}
              </Badge>
            </div>

            {/* Article Header */}
            <header className="mb-6">
              <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(article.createdAt)}</span>
                </div>
                <Badge variant="outline" className="bg-transparent">
                  {getRelativeTime(article.createdAt)}
                </Badge>
              </div>
            </header>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t.article.share}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    {linkCopied ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Link2 className="mr-2 h-4 w-4" />
                    )}
                    {linkCopied ? t.article.linkCopied : t.article.copyLink}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareFacebook}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {t.article.shareOnFacebook}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareWhatsApp}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t.article.shareOnWhatsApp}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant={isArchived ? "default" : "outline"}
                size="sm"
                onClick={handleArchiveToggle}
                className={isArchived ? "" : "bg-transparent"}
              >
                {isArchived ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    {t.article.removeFromArchive}
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    {t.article.saveToArchive}
                  </>
                )}
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Summary */}
            <p className="mb-6 text-lg font-medium leading-relaxed text-foreground/90">
              {article.summary}
            </p>

            {/* Full Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            <Separator className="my-8" />

            {/* Tags Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">{t.article.tags}</h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.article.relatedArticles}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/article/${related.id}`}
                      className="group block"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={related.imageUrl || "/placeholder.svg"}
                            alt={related.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                            {related.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {getRelativeTime(related.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tags Cloud */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.article.popularTags}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(mockArticles.flatMap((a) => a.tags))].slice(0, 12).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer bg-transparent transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
