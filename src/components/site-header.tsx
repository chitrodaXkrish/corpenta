import Image from "next/image";

export function SiteHeader(){
  return <header className="site-header site-header-shape-only">
    <svg className="nav-swoop" viewBox="0 0 1000 112" preserveAspectRatio="none" aria-hidden="true">
      <path d="M310 0H690C723 0 721 29 746 67C770 100 790 112 824 112H176C210 112 230 100 254 67C279 29 277 0 310 0Z"/>
    </svg>
    <div className="header-logo-badge"><Image src="/logo.png" alt="Corpenta Global" width={393} height={350} priority/></div>
  </header>;
}
