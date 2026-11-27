import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChartNoAxesColumnIncreasing, Globe2, Monitor, ShieldCheck } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { PublicMarketTicker } from "@/components/public-market-ticker";
import { HomeCourses } from "@/components/home-courses";
import { FinancialGlobe } from "@/components/financial-globe";

export const metadata = createPageMetadata({
  title: "Currency Education for Clearer Market Decisions",
  description: "Build a thoughtful understanding of currency and financial markets with Corpenta Global’s structured education, market context and risk-aware learning.",
  path: "/",
});

export default async function Home() {
  return <main className="homepage-main">
  <section className="hero" data-market-scene="network">
    <div className="hero-visual">
      <FinancialGlobe className="hero-globe" rotationSpeed={0.018} glowIntensity={1.15} globeSize={1}/>
      <h1 className="hero-globe-title">Educate Nation. <span>Empower the World.</span></h1>
      <div className="hero-copy">
        <p className="hero-vision-title">A Financially Literate Nation. A Financially Empowered World.</p>
        <p>Financial Knowledge Without Borders.</p>
        <Link className="button button-orange hero-explore-cta" href="/courses">Explore Courses <ArrowRight size={18}/></Link>
        <Link className="button hero-go-live-cta" href="/student/live-classes"><span className="hero-live-dot" aria-hidden="true"/>GO LIVE</Link>
        <div className="hero-points" aria-label="Learning features">
          <div><ChartNoAxesColumnIncreasing/><span>Structured<br/>learning</span></div>
          <div><Monitor/><span>Online<br/>courses</span></div>
          <div><ShieldCheck/><span>Risk-aware<br/>practice</span></div>
          <div><Globe2/><span>Global<br/>markets</span></div>
        </div>
      </div>
    </div>
  </section>

  <PublicMarketTicker/>

  <section className="home-founder-section" aria-labelledby="home-founder-name">
    <div className="home-founder-portrait">
      <Image src="/founder.png" alt="Avanish Yadav, Founder and CEO of Corpenta Global" fill sizes="(max-width: 760px) 100vw, 38vw" priority />
    </div>
    <div className="home-founder-copy">
      <span className="home-founder-kicker">A NOTE FROM THE FOUNDER</span>
      <h2 id="home-founder-name">Avanish<br/><em>Yadav.</em></h2>
      <p className="home-founder-role">Founder &amp; CEO <i>·</i> Global Financial Markets Educator</p>
      <p className="home-founder-intro">More than a decade in financial markets informs Avanish’s approach to education: build understanding, develop discipline, and treat risk with care.</p>
      <Link className="home-founder-cta" href="/founders-desk">Know More <ArrowRight size={17}/></Link>
    </div>
  </section>

  <section className="intro-section wrap section-pad" data-market-scene="currencies"><div className="section-kicker"><span>01 / THE ACADEMY</span></div><div className="intro-grid"><h2>Markets reward<br/><em>preparation,</em><br/>not certainty.</h2><div className="intro-copy"><p>Corpenta Global is a home for people who want to understand how financial markets, including currency markets, move and build a more disciplined relationship with risk.</p><p>We bring structured learning and market context together—without promises, shortcuts, or the noise of prediction.</p><Link className="underlined-link" href="/about">Get to know our approach <ArrowUpRight size={15}/></Link></div></div></section>

  <section className="method-section" data-market-scene="pairs"><div className="wrap method-inner"><div className="method-heading"><div className="section-kicker"><span>02 / HOW WE TEACH</span><span>A FRAMEWORK FOR LEARNING</span></div><h2>Build understanding<br/>that <em>travels with you.</em></h2><p>Good education creates better questions. Our learning journey is designed to make the unfamiliar more legible, one concept at a time.</p></div><div className="method-steps"><article><span>01</span><div><h3>Understand the context</h3><p>Learn the forces, language and market structure behind price movement.</p></div><ArrowUpRight size={17}/></article><article><span>02</span><div><h3>Develop a framework</h3><p>Explore repeatable ways to observe, plan and review decisions.</p></div><ArrowUpRight size={17}/></article><article><span>03</span><div><h3>Practice with perspective</h3><p>Build a reflective process that accounts for uncertainty and risk.</p></div><ArrowUpRight size={17}/></article></div></div></section>

  <section className="courses-section wrap section-pad" data-market-scene="candles"><div className="section-kicker"><span>03 / COURSES</span><span>7 PROGRAMMES</span></div><div className="section-title-row"><h2>Find your place to <em>begin.</em></h2></div><p className="section-lead">Explore the Corpenta Global learning programmes.</p><HomeCourses/><Link className="button button-orange home-courses-cta" href="/courses">Explore Courses <ArrowRight size={17}/></Link></section>

  </main>;
}
