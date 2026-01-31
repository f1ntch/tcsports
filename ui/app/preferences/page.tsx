"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Globe, Newspaper, Check, Save } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function PreferencesPage() {
  const { t } = useLanguage()
  const [preferences, setPreferences] = useState({
    // Notification preferences
    emailNotifications: true,
    pushNotifications: false,
    breakingNews: true,
    weeklyDigest: true,
    
    // Content preferences
    articlesPerPage: "10",
    autoPlayVideos: false,
    showScores: true,
    
    // Privacy preferences
    shareActivity: false,
    personalizedAds: false,
  })
  
  const [saved, setSaved] = useState(false)

  const handleSwitchChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSaved(false)
  }

  const handleSelectChange = (key: keyof typeof preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    // In production, this would save to the user_preferences table in Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t.preferences.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.preferences.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                {t.preferences.notifications}
              </CardTitle>
              <CardDescription>
                {t.preferences.notificationsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">{t.preferences.emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.emailNotificationsDesc}
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => handleSwitchChange("emailNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">{t.preferences.pushNotifications}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.pushNotificationsDesc}
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => handleSwitchChange("pushNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="breakingNews">{t.preferences.breakingNews}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.breakingNewsDesc}
                  </p>
                </div>
                <Switch
                  id="breakingNews"
                  checked={preferences.breakingNews}
                  onCheckedChange={() => handleSwitchChange("breakingNews")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyDigest">{t.preferences.weeklyDigest}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.weeklyDigestDesc}
                  </p>
                </div>
                <Switch
                  id="weeklyDigest"
                  checked={preferences.weeklyDigest}
                  onCheckedChange={() => handleSwitchChange("weeklyDigest")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                {t.preferences.content}
              </CardTitle>
              <CardDescription>
                {t.preferences.contentDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="articlesPerPage">{t.preferences.articlesPerPage}</Label>
                </div>
                <Select
                  value={preferences.articlesPerPage}
                  onValueChange={(value) => handleSelectChange("articlesPerPage", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoPlayVideos">{t.preferences.autoPlayVideos}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.autoPlayVideosDesc}
                  </p>
                </div>
                <Switch
                  id="autoPlayVideos"
                  checked={preferences.autoPlayVideos}
                  onCheckedChange={() => handleSwitchChange("autoPlayVideos")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showScores">{t.preferences.showLiveScores}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.showLiveScoresDesc}
                  </p>
                </div>
                <Switch
                  id="showScores"
                  checked={preferences.showScores}
                  onCheckedChange={() => handleSwitchChange("showScores")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                {t.preferences.privacy}
              </CardTitle>
              <CardDescription>
                {t.preferences.privacyDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shareActivity">{t.preferences.shareActivity}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.shareActivityDesc}
                  </p>
                </div>
                <Switch
                  id="shareActivity"
                  checked={preferences.shareActivity}
                  onCheckedChange={() => handleSwitchChange("shareActivity")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="personalizedAds">{t.preferences.personalizedAds}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.preferences.personalizedAdsDesc}
                  </p>
                </div>
                <Switch
                  id="personalizedAds"
                  checked={preferences.personalizedAds}
                  onCheckedChange={() => handleSwitchChange("personalizedAds")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="min-w-32">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t.preferences.successTitle}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.preferences.savePreferences}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
