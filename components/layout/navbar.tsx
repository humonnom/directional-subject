'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { LogOut, LayoutDashboard, FileText } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { logout, isLoggedIn } = useAuth()

  if (!isLoggedIn) return null

  const navItems = [
    {
      href: '/posts',
      label: '게시판',
      icon: FileText,
    },
    {
      href: '/dashboard',
      label: '대시보드',
      icon: LayoutDashboard,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/posts" className="text-xl font-bold">
            게시판
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
          <LogOut className="size-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </Button>
      </div>
    </header>
  )
}
