"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UserPlus, Heart, Rss, User, Settings, LogOut, SlidersHorizontal, Archive, Globe, Check } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useLanguage, languageNames } from "./language-provider"
import { Language } from "@/lib/translations"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

// Mock user - in production this would come from Supabase auth state
const mockUser = {
  fullName: "John Doe",
  email: "user@example.com",
  isLoggedIn: true,
}

export function AppSidebar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const navigationItems = [
    { title: t.nav.home, href: "/", icon: Home },
    { title: t.nav.register, href: "/register", icon: UserPlus, hideWhenLoggedIn: true },
    { title: t.nav.interests, href: "/interests", icon: Heart },
    { title: t.nav.liveFeed, href: "/live-feed", icon: Rss },
    { title: t.nav.myArchive, href: "/archive", icon: Archive },
    { title: t.nav.preferences, href: "/preferences", icon: SlidersHorizontal },
  ]

  const visibleNavItems = navigationItems.filter(
    (item) => !(item.hideWhenLoggedIn && mockUser.isLoggedIn)
  )

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">,,,</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-sidebar-foreground">TC Sports</span>
            <span className="text-xs text-sidebar-foreground/70">Tres Comas Sports Hub</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.nav.navigation}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-sidebar-foreground/70">{t.nav.theme}</span>
          <ThemeToggle />
        </div>

        {mockUser.isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-sidebar-accent transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {mockUser.fullName}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">
                    {mockUser.email}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{mockUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  {t.user.profileSettings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Globe className="mr-2 h-4 w-4" />
                  {t.user.language}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className="flex items-center justify-between"
                    >
                      {languageNames[lang]}
                      {language === lang && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t.user.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
