import Image from "next/image";
import Link from "next/link";
import { HeroMenu } from "@/components/hero-menu";

export function SiteHeader(){
  return <header className="site-header site-header-terminal">
    <HeroMenu/>
    <Link className="header-logo-badge" href="/" aria-label="Corpenta Global home"><Image src="/logo.png" alt="" width={393} height={350} priority/></Link>
    <Link className="header-get-started header-courses" href="/courses">Courses</Link>
    <Link className="header-get-started" href="/register">Get Started</Link>
  </header>;
}
