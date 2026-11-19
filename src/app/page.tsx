import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { getPublicCourses, getPublicScenarios } from "@/lib/public-content";
import { MockForexFeed } from "@/components/mock-forex-feed";

export const metadata = createPageMetadata({
  title: "Forex Education for Clearer Market Decisions",
  description: "Build a thoughtful understanding of forex and financial markets with Corpenta Global’s structured education, market context and risk-aware learning.",
  path: "/",
});

export default async function Home() {
  const [courses, scenarios] = await Promise.all([getPublicCourses(), getPublicScenarios()]);
  return <main>
  <section className="hero">
    <div className="hero-visual">
      <div className="hero-copy"><span className="hero-brand-line"><i/> CORPENTA GLOBAL <span>·</span> FOREX EDUCATION</span><h1>{siteContent.headline.split(/(markets?\.?|strategy\.?)/i).map((part,index)=>/^markets?\.?$/i.test(part)?<span className="hero-highlight" key={index}>{part}</span>:/^strategy\.?$/i.test(part)?<span className="hero-highlight hero-strategy" key={index}>{part}</span>:part)}</h1><Link className="button button-orange hero-explore-cta" href="/courses">Explore Courses</Link></div>
      <div className="hero-globe-stage">
        <div className="hero-globe" aria-hidden="true">
          <svg className="hero-globe-map" viewBox="0 0 700 700" role="presentation">
            <defs><clipPath id="globeClip"><circle cx="350" cy="350" r="314"/></clipPath></defs>
            <circle className="globe-surface" cx="350" cy="350" r="314"/>
            <g clipPath="url(#globeClip)">
              <g className="globe-meridians"><ellipse cx="350" cy="350" rx="104" ry="314"/><ellipse cx="350" cy="350" rx="214" ry="314"/><path d="M36 350h628M56 250h588M56 450h588M104 160h492M104 540h492"/></g>
              <g className="globe-continents">
                <path d="M91 207l30-31 42-8 28 16 16 27 31 8 16 23-6 26-24 14-12 24-29 9-14 29-24-7-8-28-20-13-5-33-27-18-11-25-18-8 3-28z"/>
                <path d="M224 326l24 4 17 22 2 29-14 32-5 37-18 32-3 42-16 38-17-24-3-38-15-31 7-36-7-27 12-35 20-26z"/>
                <path d="M324 182l20-21 29 6 14 18 26 2 16 18-8 18-22 4-10 19-23 2-13-16-24-5-12-19 7-26z"/>
                <path d="M330 253l29-15 29 12 20 29-7 40 17 31-8 42-22 39-9 46-23 37-21-20-9-38-23-23 5-35-17-25 9-40-12-33 22-27z"/>
                <path d="M404 182l38-17 40 10 22-8 50 22 31 30-19 20-36-8-18 23-33 2-16 19-28-14-20 9-20-20-24-2-21-23 14-20-10-23z"/>
                <path d="M512 347l27-8 22 17 30 4 19 24-13 25-26 4-13 20-29-5-16-20-24-7 5-27-12-17z"/>
                <path d="M543 481l28-7 22 15-9 22-24 8-21-14z"/>
              </g>
              <g className="globe-routes">
                <path d="M160 264Q266 146 361 227T541 286"/>
                <path d="M215 361Q310 250 405 318T551 369"/>
                <path d="M300 222Q391 168 453 244T546 286"/>
                <path d="M206 342Q300 411 390 360T525 333"/>
              </g>
              <g className="globe-nodes">
                <circle cx="160" cy="264" r="5"/><circle cx="276" cy="188" r="4"/><circle cx="361" cy="227" r="6"/><circle cx="433" cy="250" r="4"/><circle cx="541" cy="286" r="5"/>
                <circle cx="215" cy="361" r="4"/><circle cx="310" cy="306" r="5"/><circle cx="405" cy="318" r="6"/><circle cx="482" cy="350" r="4"/><circle cx="551" cy="369" r="5"/>
                <circle cx="453" cy="244" r="4"/><circle cx="390" cy="360" r="4"/><circle cx="525" cy="333" r="5"/>
              </g>
            </g>
            <circle className="globe-rim" cx="350" cy="350" r="314"/>
            <g className="globe-latitude-overlay"><ellipse cx="350" cy="350" rx="314" ry="105"/><ellipse cx="350" cy="350" rx="314" ry="218"/></g>
          </svg>
          <span className="globe-currency-mark globe-currency-euro">€</span><span className="globe-currency-mark globe-currency-yen">¥</span><span className="globe-currency-mark globe-currency-pound">£</span>
        </div>
        <div className="globe-status"><i/><span>GLOBAL FX NETWORK</span><b>ROTATING STUDY VIEW</b></div>
        <MockForexFeed/>
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
