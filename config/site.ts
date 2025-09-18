/**
 * Global (non-CMS) site configuration.
 * Extend this file as your project grows.
 */

export interface NavItem {
  title: string
  href: string
}

interface SiteConfig {
  mainNav: NavItem[]
}

export const siteConfig: SiteConfig = {
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Packages", href: "/packages" },
    { title: "Destinations", href: "/destinations" },
    { title: "Testimonials", href: "/testimonials" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
}
