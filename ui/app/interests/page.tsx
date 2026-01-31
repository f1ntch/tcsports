"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

// Mock sports data - would come from Supabase 'sports' table
const MOCK_SPORTS = [
  { id: 1, nameKey: "football", description: "Soccer leagues and tournaments worldwide" },
  { id: 2, nameKey: "basketball", description: "NBA, EuroLeague, and international basketball" },
  { id: 3, nameKey: "tennis", description: "Grand Slams, ATP, and WTA tours" },
  { id: 4, nameKey: "cycling", description: "Tour de France, Giro d'Italia, and more" },
  { id: 5, nameKey: "swimming", description: "Olympics, World Championships, and swimming news" },
  { id: 6, nameKey: "formula1", description: "F1 races, teams, and drivers" },
  { id: 7, nameKey: "golf", description: "PGA Tour, majors, and golf news" },
  { id: 8, nameKey: "rugby", description: "Six Nations, World Cup, and rugby leagues" },
  { id: 9, nameKey: "baseball", description: "MLB and international baseball leagues" },
  { id: 10, nameKey: "hockey", description: "NHL and international ice hockey" },
  { id: 11, nameKey: "volleyball", description: "International volleyball and beach volleyball" },
  { id: 12, nameKey: "boxing", description: "Boxing matches, fighters, and news" },
]

export default function InterestsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedSports, setSelectedSports] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleSport = (sportId: number) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId]
    )
  }

  const handleSave = async () => {
    if (selectedSports.length === 0) return

    setIsLoading(true)

    // Mock save - would insert into Supabase 'user_interests' table
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setSaved(true)

    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const getSportName = (nameKey: string) => {
    return t.sports[nameKey as keyof typeof t.sports] || nameKey
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {t.interests.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t.interests.subtitle}
            </p>
          </div>

          {saved ? (
            <Card className="mx-auto max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t.interests.successTitle}</h2>
                    <p className="mt-1 text-muted-foreground">
                      {t.interests.successMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_SPORTS.map((sport) => {
                  const isSelected = selectedSports.includes(sport.id)
                  return (
                    <Card
                      key={sport.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50",
                        isSelected && "border-primary bg-primary/5 ring-1 ring-primary"
                      )}
                      onClick={() => toggleSport(sport.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{getSportName(sport.nameKey)}</CardTitle>
                          </div>
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{sport.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {selectedSports.length === 0
                    ? ""
                    : `${selectedSports.length} ${t.interests.selected}`}
                </p>
                <Button
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleSave}
                  disabled={selectedSports.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.interests.saving}
                    </>
                  ) : (
                    t.interests.saveInterests
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
