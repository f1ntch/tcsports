"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Mock user - in production this would come from Supabase auth state
const mockUser = {
  fullName: "John Doe",
  email: "user@example.com",
  isLoggedIn: true,
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">,,,</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-foreground">TC Sports</span>
            <span className="text-xs text-muted-foreground">Tres Comas Sports Hub</span>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Register
          </Link>
          <Link href="/interests" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Interests
          </Link>
          <Link href="/live-feed" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Live Feed
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {mockUser.isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden text-sm font-medium text-foreground sm:inline-block">
                    {mockUser.fullName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/register">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
