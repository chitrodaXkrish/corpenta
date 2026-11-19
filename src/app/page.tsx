import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { getPublicCourses, getPublicScenarios } from "@/lib/public-content";

export const metadata = createPageMetadata({
  title: "Forex Education for Clearer Market Decisions",
  description: "Build a thoughtful understanding of forex and financial markets with Corpenta Global’s structured education, market context and risk-aware learning.",
  path: "/",
});

const illustrativeCandles=[
  [300,354,314,331],[272,326,329,289],[280,344,293,326],[248,310,324,269],
  [252,318,275,302],[222,286,299,241],[232,302,246,278],[208,266,281,224],
  [218,286,229,267],[192,252,270,205],[202,272,210,241],[178,238,246,193],
  [188,252,198,226],[166,226,231,181],[174,241,185,218],[151,213,220,169],
  [164,232,176,207],[142,201,210,158],[151,219,165,194],[128,190,198,146],
  [141,211,153,184],[119,180,190,137],[128,202,142,171],[105,173,179,122],
];

export default async function Home() {
  const [courses, scenarios] = await Promise.all([getPublicCourses(), getPublicScenarios()]);
  return <main>
  <section className="hero">
    <div className="hero-visual">
      <div className="hero-copy"><span className="hero-brand-line"><i/> CORPENTA GLOBAL <span>·</span> FOREX EDUCATION</span><h1>{siteContent.headline.split(/(markets?\.?|strategy\.?)/i).map((part,index)=>/^markets?\.?$/i.test(part)?<span className="hero-highlight" key={index}>{part}</span>:/^strategy\.?$/i.test(part)?<span className="hero-highlight hero-strategy" key={index}>{part}</span>:part)}</h1><Link className="button button-orange hero-explore-cta" href="/courses">Explore Courses</Link></div>
      <div className="hero-market-terminal" role="img" aria-label="Illustrative forex candlestick chart and currency pairs. Not live market data.">
        <div className="hero-terminal-top"><span><i/> MARKET STRUCTURE <b>/</b> STUDY VIEW</span><span className="terminal-tag">ILLUSTRATIVE</span></div>
        <div className="hero-chart-heading"><div><span>MAJOR PAIR</span><strong>EUR <i>/</i> USD</strong></div><div className="chart-period">FX · 4H</div></div>
        <div className="hero-chart-area">
          <svg className="hero-candlestick-chart" viewBox="0 0 720 430" preserveAspectRatio="none" aria-hidden="true">
            <g className="chart-grid">{[70,140,210,280,350].map(y=><line key={`h${y}`} x1="0" x2="720" y1={y} y2={y}/>)}{[90,210,330,450,570,690].map(x=><line key={`v${x}`} x1={x} x2={x} y1="35" y2="350"/>)}</g>
            <g className="chart-axis-labels"><text x="650" y="65">—</text><text x="650" y="137">—</text><text x="650" y="209">—</text><text x="650" y="281">—</text><text x="650" y="353">—</text></g>
            <g className="chart-candles">{illustrativeCandles.map(([high,low,open,close],index)=>{const x=20+index*27.5,up=close<open,top=Math.min(open,close),height=Math.max(7,Math.abs(close-open));return <g key={index} className={up?"candle-up":"candle-down"}><line x1={x} x2={x} y1={high} y2={low}/><rect x={x-6} y={top} width="12" height={height}/></g>})}</g>
            <line className="chart-current-rule" x1="0" x2="720" y1="122" y2="122"/>
          </svg>
          <div className="hero-currency-watermark" aria-hidden="true">€ <span>/</span> $</div>
          <div className="hero-chart-stamp"><span>PRICE ACTION</span><strong>Study the movement.</strong><small>Illustrative visual · not live market data</small></div>
        </div>
        <div className="hero-chart-footer"><span>EUR / USD</span><span>GBP / USD</span><span>USD / JPY</span><span className="chart-footer-note"><i/> EDUCATIONAL VIEW</span></div>
      </div>
      <div className="hero-market-footnote"><span>01</span><span>FOREX · STRUCTURE · DISCIPLINE</span><span>MARKET STUDY / NOT LIVE DATA</span></div>
    </div>
    <div className="hero-caption"><span>Thoughtful education. Independent decisions.</span><span>Scroll to explore <ArrowDown size={14}/></span></div>
  </section>

  <section className="intro-section wrap section-pad"><div className="section-kicker"><span>01 / THE ACADEMY</span><span>LEARN WITH INTENTION</span></div><div className="intro-grid"><h2>Markets reward<br/><em>preparation,</em><br/>not certainty.</h2><div className="intro-copy"><p>Corpenta Global is a home for people who want to understand how financial markets, including forex, move and build a more disciplined relationship with risk.</p><p>We bring structured learning and market context together—without promises, shortcuts, or the noise of prediction.</p><Link className="underlined-link" href="/about">Get to know our approach <ArrowUpRight size={15}/></Link></div></div></section>

  <section className="method-section"><div className="wrap method-inner"><div className="method-heading"><div className="section-kicker"><span>02 / HOW WE TEACH</span><span>A FRAMEWORK FOR LEARNING</span></div><h2>Build understanding<br/>that <em>travels with you.</em></h2><p>Good education creates better questions. Our learning journey is designed to make the unfamiliar more legible, one concept at a time.</p></div><div className="method-steps"><article><span>01</span><div><h3>Understand the context</h3><p>Learn the forces, language and market structure behind price movement.</p></div><ArrowUpRight size={17}/></article><article><span>02</span><div><h3>Develop a framework</h3><p>Explore repeatable ways to observe, plan and review decisions.</p></div><ArrowUpRight size={17}/></article><article><span>03</span><div><h3>Practice with perspective</h3><p>Build a reflective process that accounts for uncertainty and risk.</p></div><ArrowUpRight size={17}/></article></div></div></section>

  <section className="courses-section wrap section-pad"><div className="section-kicker"><span>03 / THE ACADEMY</span><span>COURSES · {courses.length} PROGRAMS</span></div><div className="section-title-row"><h2>A place to <em>begin.</em></h2><Link className="underlined-link" href="/courses">View the academy <ArrowUpRight size={15}/></Link></div><p className="section-lead">Explore the learning programs currently published by Corpenta Global.</p>{courses.length?<div className="course-grid">{courses.slice(0,3).map((course,i)=><Link className="course-card" key={course.id} href={`/courses/${course.id}`}><div className={`course-art course-art-${i+1}`}><span>0{i+1}</span><div className="art-orbit"/><ArrowUpRight size={18}/></div><div className="course-meta"><span>{course.duration_label||"ACADEMY PROGRAM"}</span><span>{course.price===null?"ENROLLMENT DETAILS SOON":`${course.currency} ${Number(course.price).toLocaleString()}`}</span></div><h3>{course.title}</h3><p>{course.short_description}</p><div className="course-bottom"><span>View course details</span><ArrowRight size={15}/></div></Link>)}</div>:<div className="locked-panel"><div><strong>Courses are being prepared</strong><p>Published programs will appear here when the academy has confirmed their details.</p></div></div>}</section>

  <section className="scenario-section"><div className="wrap scenario-inner"><div><div className="section-kicker"><span>04 / MARKET NOTES</span><span>EDUCATIONAL COMMENTARY</span></div><h2>Observation over<br/><em>prediction.</em></h2><p>Occasional market scenarios, shared for learning and discussion. Not a signal service or a recommendation to trade.</p><Link className="underlined-link" href="/scenarios">Explore market notes <ArrowUpRight size={15}/></Link></div><div className="scenario-list">{scenarios.length?scenarios.map((s)=><article className="scenario-row" key={s.id}><div className="scenario-symbol">↗</div><div className="scenario-info"><div><strong>{s.pair}</strong><span className="scenario-tag">{s.direction||"Watching"}</span></div><p>{s.commentary||s.description||"Educational market scenario."}</p></div><span className="scenario-time">{new Date(s.published_at).toLocaleDateString("en",{month:"short",day:"numeric"})}</span></article>):<div className="locked-panel"><div><strong>No public market notes yet</strong><p>Published educational scenarios will appear here.</p></div></div>}</div></div></section>

  <section className="closing-section wrap"><div className="closing-card"><div className="closing-orb"/><span className="eyebrow">BEGIN WITH A BETTER QUESTION</span><h2>Curiosity is a<br/><em>good first step.</em></h2><p>Explore the academy and find the learning path that fits your starting point.</p><Link className="button button-orange" href="/courses">Explore courses</Link><span className="closing-mark">C</span></div></section>
  </main>;
}
