import Image from "next/image";
import Link from "next/link";
import { HeroMenu } from "@/components/hero-menu";

export function SiteHeader(){
  return <header className="site-header site-header-terminal">
    <HeroMenu/>
    <Link className="header-logo-badge" href="/" aria-label="Corpenta Global home"><Image src="/logo.png" alt="" width={393} height={350} priority/></Link>
    <nav className="header-nav-links" aria-label="Main navigation">
      <Link href="/login">Log In</Link>
      <Link href="/courses">Courses</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact Us</Link>
    </nav>
    <div className="header-actions-right">
      <Link className="header-get-started" href="/register">Get Started</Link>
    </div>
  </header>;
}
