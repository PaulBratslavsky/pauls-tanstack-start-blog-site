import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './theme-toggle'
import { StrapiImage } from './strapi-image'
import { LoggedInUser } from './logged-in-user'
import type { THeader, TLink } from '../../types'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ITopNavigationProps {
  header?: THeader
  currentUser?: {
    userId: number
    email?: string
    username?: string
  } | null
}

export function TopNavigation({
  header,
  currentUser,
}: Readonly<ITopNavigationProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // If no header data at all, don't render anything
  if (!header) return null

  const logo = header.logo
  const navItems = header.navItems || []
  const cta = header.cta
  const imageUrl = logo?.image?.url

  return (
    <section className="bg-white dark:bg-dark p-6 flex justify-center items-center">
      {/* Desktop Menu */}
      <nav className="w-full max-w-7xl bg-background shadow-shadow border-2 border-border rounded-lg px-4 hidden lg:block">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo ? (
            <Link
              to={logo.href || '/'}
              className="flex items-center gap-2 text-foreground hover:text-main transition-colors"
              target={logo.isExternal ? '_blank' : undefined}
              rel={logo.isExternal ? 'noopener noreferrer' : undefined}
            >
              {imageUrl && (
                <StrapiImage
                  src={imageUrl}
                  alt={logo.image?.alternativeText || logo.label}
                  aspectRatio="square"
                />
              )}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.label || 'App'}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tighter text-foreground">
                App
              </span>
            </div>
          )}

          {/* Navigation Items */}
          {navItems.length > 0 && (
            <div className="flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-8">
                  {navItems.map((item) => renderNavItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          {/* CTA / User Actions */}
          <div className="flex gap-2 items-center">
            {currentUser ? (
              <LoggedInUser
                userData={{
                  username: currentUser.username || '',
                  email: currentUser.email || '',
                }}
              />
            ) : cta ? (
              <Button
                asChild
                variant={cta.type === 'PRIMARY' ? 'default' : 'neutral'}
                size="default"
              >
                <Link
                  to={cta.href}
                  target={cta.isExternal ? '_blank' : undefined}
                  rel={cta.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {cta.label}
                </Link>
              </Button>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav className="w-full bg-background shadow-shadow border-2 border-border rounded-lg px-4 block lg:hidden">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo ? (
            <Link
              to={logo.href || '/'}
              className="flex items-center gap-2 text-foreground hover:text-main transition-colors"
              target={logo.isExternal ? '_blank' : undefined}
              rel={logo.isExternal ? 'noopener noreferrer' : undefined}
            >
              {imageUrl && (
                <StrapiImage
                  src={imageUrl}
                  alt={logo.image?.alternativeText || logo.label}
                  aspectRatio="square"
                />
              )}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.label || 'App'}
              </span>
            </Link>
          ) : (
            <span className="text-lg font-semibold tracking-tighter text-foreground">
              App
            </span>
          )}
          <div className="flex gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {logo ? (
                      <Link
                        to={logo.href || '/'}
                        className="flex items-center gap-2"
                        target={logo.isExternal ? '_blank' : undefined}
                        rel={logo.isExternal ? 'noopener noreferrer' : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {imageUrl && (
                          <StrapiImage
                            src={imageUrl}
                            alt={logo.image?.alternativeText || logo.label}
                            aspectRatio="square"
                          />
                        )}
                        <span className="text-lg font-semibold">
                          {logo.label || 'App'}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-lg font-semibold">App</span>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  {navItems.length > 0 && (
                    <div className="flex w-full flex-col gap-4">
                      {navItems.map((item) =>
                        renderMobileNavItem(item, () => setMobileMenuOpen(false))
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {currentUser ? (
                      <LoggedInUser
                        userData={{
                          username: currentUser.username || '',
                          email: currentUser.email || '',
                        }}
                      />
                    ) : cta ? (
                      <Button
                        asChild
                        variant={cta.type === 'PRIMARY' ? 'default' : 'neutral'}
                      >
                        <Link
                          to={cta.href}
                          target={cta.isExternal ? '_blank' : undefined}
                          rel={
                            cta.isExternal ? 'noopener noreferrer' : undefined
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cta.label}
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </section>
  )
}

const renderNavItem = (item: TLink) => {
  return (
    <NavigationMenuItem key={item.id}>
      <NavigationMenuLink
        asChild
        className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent"
      >
        <Link
          to={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          className="text-foreground hover:text-main transition-colors font-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
        >
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileNavItem = (item: TLink, onNavigate: () => void) => {
  return (
    <Button key={item.id} asChild variant="neutral" className="w-full justify-start">
      <Link
        to={item.href}
        target={item.isExternal ? '_blank' : undefined}
        rel={item.isExternal ? 'noopener noreferrer' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    </Button>
  )
}
