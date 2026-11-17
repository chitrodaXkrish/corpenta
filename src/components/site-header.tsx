import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";

export function SiteHeader(){
  return <header className="site-header site-header-shape-only">
    <svg className="nav-swoop" viewBox="0 0 1000 112" preserveAspectRatio="none" aria-hidden="true">
      <path d="M310 0H690C723 0 721 29 746 67C770 100 790 112 824 112H176C210 112 230 100 254 67C279 29 277 0 310 0Z"/>
    </svg>
    <Link className="header-logo-badge" href="/" aria-label="Corpenta Global home"><Image src="/logo.png" alt="" width={393} height={350} priority/></Link>
    <Link className="header-get-started header-courses" href="/courses">Courses <ArrowUpRight size={15} aria-hidden="true"/></Link>
    <Link className="header-get-started" href="/register">Get Started <ArrowUpRight size={15} aria-hidden="true"/></Link>
  </header>;
}
