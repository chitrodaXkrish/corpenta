import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { getPublicCourses, getPublicScenarios } from "@/lib/public-content";
import { RotatingForexGlobe } from "@/components/rotating-forex-globe";

export const metadata = createPageMetadata({
  title: "Forex Education for Clearer Market Decisions",
  description: "Build a thoughtful understanding of forex and financial markets with Corpenta Global’s structured education, market context and risk-aware learning.",
  path: "/",
});

export default async function Home() {
  const [courses, scenarios] = await Promise.all([getPublicCourses(), getPublicScenarios()]);
  return <main>
  <section className="hero" data-market-scene="network">
    <div className="hero-visual">
      <div className="hero-copy"><h1>{siteContent.headline.split(/(markets?\.?|strategy\.?)/i).map((part,index)=>/^markets?\.?$/i.test(part)?<span className="hero-highlight" key={index}>{part}</span>:/^strategy\.?$/i.test(part)?<span className="hero-highlight hero-strategy" key={index}>{part}</span>:part)}</h1><Link className="button button-orange hero-explore-cta" href="/courses">Explore Courses</Link></div>
      <div className="hero-globe-stage">
        <div className="globe-orbit globe-orbit-outer" aria-hidden="true"/><div className="globe-orbit globe-orbit-inner" aria-hidden="true"/>
        <div className="hero-globe" aria-hidden="true"><RotatingForexGlobe/></div>
        <div className="globe-data-card globe-data-card-top"><span><i/> MARKET PULSE</span><strong>24<span> / 5</span></strong><small>Global markets in motion</small></div>
        <div className="globe-data-card globe-data-card-bottom"><span>LEARNING NOTE</span><strong>Context before conviction.</strong><small>Build a view. Review the evidence.</small></div>
        <span className="globe-coordinate globe-coordinate-one">51°30′N&nbsp; 0°07′W</span><span className="globe-coordinate globe-coordinate-two">GLOBAL NETWORK / 01</span>
        <div className="globe-pair globe-pair-one"><b>EUR</b><span>EURO</span><i>↗</i></div><div className="globe-pair globe-pair-two"><b>JPY</b><span>YEN</span><i>↘</i></div>
      </div>
    </div>
    <div className="hero-caption"><span>Thoughtful education. Independent decisions.</span><span>Scroll to explore <ArrowDown size={14}/></span></div>
  </section>

  <section className="intro-section wrap section-pad" data-market-scene="currencies"><div className="section-kicker"><span>01 / THE ACADEMY</span></div><div className="intro-grid"><h2>Markets reward<br/><em>preparation,</em><br/>not certainty.</h2><div className="intro-copy"><p>Corpenta Global is a home for people who want to understand how financial markets, including forex, move and build a more disciplined relationship with risk.</p><p>We bring structured learning and market context together—without promises, shortcuts, or the noise of prediction.</p><Link className="underlined-link" href="/about">Get to know our approach <ArrowUpRight size={15}/></Link></div></div></section>

  <section className="method-section" data-market-scene="pairs"><div className="wrap method-inner"><div className="method-heading"><div className="section-kicker"><span>02 / HOW WE TEACH</span><span>A FRAMEWORK FOR LEARNING</span></div><h2>Build understanding<br/>that <em>travels with you.</em></h2><p>Good education creates better questions. Our learning journey is designed to make the unfamiliar more legible, one concept at a time.</p></div><div className="method-steps"><article><span>01</span><div><h3>Understand the context</h3><p>Learn the forces, language and market structure behind price movement.</p></div><ArrowUpRight size={17}/></article><article><span>02</span><div><h3>Develop a framework</h3><p>Explore repeatable ways to observe, plan and review decisions.</p></div><ArrowUpRight size={17}/></article><article><span>03</span><div><h3>Practice with perspective</h3><p>Build a reflective process that accounts for uncertainty and risk.</p></div><ArrowUpRight size={17}/></article></div></div></section>

  <section className="courses-section wrap section-pad" data-market-scene="candles"><div className="section-kicker"><span>03 / THE ACADEMY</span><span>COURSES · {courses.length} PROGRAMS</span></div><div className="section-title-row"><h2>A place to <em>begin.</em></h2><Link className="underlined-link" href="/courses">View the academy <ArrowUpRight size={15}/></Link></div><p className="section-lead">Explore the learning programs currently published by Corpenta Global.</p>{courses.length?<div className="course-grid">{courses.slice(0,3).map((course,i)=><Link className="course-card" key={course.id} href={`/courses/${course.id}`}><div className={`course-art course-art-${i+1}`}><span>0{i+1}</span><div className="art-orbit"/><ArrowUpRight size={18}/></div><div className="course-meta"><span>{course.duration_label||"ACADEMY PROGRAM"}</span><span>{course.price===null?"ENROLLMENT DETAILS SOON":`${course.currency} ${Number(course.price).toLocaleString()}`}</span></div><h3>{course.title}</h3><p>{course.short_description}</p><div className="course-bottom"><span>View course details</span><ArrowRight size={15}/></div></Link>)}</div>:<div className="locked-panel"><div><strong>Courses are being prepared</strong><p>Published programs will appear here when the academy has confirmed their details.</p></div></div>}</section>

  <section className="scenario-section" data-market-scene="research"><div className="wrap scenario-inner"><div><div className="section-kicker"><span>04 / MARKET NOTES</span><span>EDUCATIONAL COMMENTARY</span></div><h2>Observation over<br/><em>prediction.</em></h2><p>Occasional market scenarios, shared for learning and discussion. Not a signal service or a recommendation to trade.</p><Link className="underlined-link" href="/scenarios">Explore market notes <ArrowUpRight size={15}/></Link></div><div className="scenario-list">{scenarios.length?scenarios.map((s)=><article className="scenario-row" key={s.id}><div className="scenario-symbol">↗</div><div className="scenario-info"><div><strong>{s.pair}</strong><span className="scenario-tag">{s.direction||"Watching"}</span></div><p>{s.commentary||s.description||"Educational market scenario."}</p></div><span className="scenario-time">{new Date(s.published_at).toLocaleDateString("en",{month:"short",day:"numeric"})}</span></article>):<div className="locked-panel"><div><strong>No public market notes yet</strong><p>Published educational scenarios will appear here.</p></div></div>}</div></div></section>

  <section className="closing-section wrap" data-market-scene="ticker"><div className="closing-card"><div className="closing-orb"/><span className="eyebrow">BEGIN WITH A BETTER QUESTION</span><h2>Curiosity is a<br/><em>good first step.</em></h2><p>Explore the academy and find the learning path that fits your starting point.</p><Link className="button button-orange" href="/courses">Explore courses</Link><span className="closing-mark">C</span></div></section>
  </main>;
}
