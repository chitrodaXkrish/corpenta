import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { courses, scenarios, siteContent } from "@/lib/content";

export default function Home() { return <main>
  <section className="hero">
    <div className="hero-visual">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-copy"><h1>{siteContent.headline}</h1></div>
      <div className="hero-index">01 <span>/</span> 04</div>
    </div>
    <div className="hero-caption"><span>Thoughtful education. Independent decisions.</span><span>Scroll to explore <ArrowDown size={14}/></span></div>
  </section>

  <section className="intro-section wrap section-pad"><div className="section-kicker"><span>01 / THE ACADEMY</span><span>LEARN WITH INTENTION</span></div><div className="intro-grid"><h2>Markets reward<br/><em>preparation,</em><br/>not certainty.</h2><div className="intro-copy"><p>Corpenta Global is a home for people who want to understand how markets move and build a more disciplined relationship with risk.</p><p>We bring structured learning and market context together—without promises, shortcuts, or the noise of prediction.</p><Link className="underlined-link" href="/about">Get to know our approach <ArrowUpRight size={15}/></Link></div></div></section>

  <section className="method-section"><div className="wrap method-inner"><div className="method-heading"><div className="section-kicker"><span>02 / HOW WE TEACH</span><span>A FRAMEWORK FOR LEARNING</span></div><h2>Build understanding<br/>that <em>travels with you.</em></h2><p>Good education creates better questions. Our learning journey is designed to make the unfamiliar more legible, one concept at a time.</p></div><div className="method-steps"><article><span>01</span><div><h3>Understand the context</h3><p>Learn the forces, language and market structure behind price movement.</p></div><ArrowUpRight size={17}/></article><article><span>02</span><div><h3>Develop a framework</h3><p>Explore repeatable ways to observe, plan and review decisions.</p></div><ArrowUpRight size={17}/></article><article><span>03</span><div><h3>Practice with perspective</h3><p>Build a reflective process that accounts for uncertainty and risk.</p></div><ArrowUpRight size={17}/></article></div></div></section>

  <section className="courses-section wrap section-pad"><div className="section-kicker"><span>03 / THE ACADEMY</span><span>COURSES · SIX PROGRAMS</span></div><div className="section-title-row"><h2>A place to <em>begin.</em></h2><Link className="underlined-link" href="/courses">View the academy <ArrowUpRight size={15}/></Link></div><p className="section-lead">Six learning pathways are being shaped by the academy. Details will be published once confirmed.</p><div className="course-grid">{courses.slice(0,3).map((course,i)=><Link className="course-card" key={course.id} href={`/courses/${course.id}`}><div className={`course-art course-art-${i+1}`}><span>0{i+1}</span><div className="art-orbit"/><ArrowUpRight size={18}/></div><div className="course-meta"><span>{course.level}</span><span>DETAILS COMING SOON</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="course-bottom"><span>Course details pending</span><ArrowRight size={15}/></div></Link>)}</div><div className="course-disclaimer">Course names, pricing, curriculum and duration are placeholders pending confirmation from Corpenta Global.</div></section>

  <section className="scenario-section"><div className="wrap scenario-inner"><div><div className="section-kicker"><span>04 / MARKET NOTES</span><span>EDUCATIONAL COMMENTARY</span></div><h2>Observation over<br/><em>prediction.</em></h2><p>Occasional market scenarios, shared for learning and discussion. Not a signal service or a recommendation to trade.</p><Link className="underlined-link" href="/scenarios">Explore market notes <ArrowUpRight size={15}/></Link></div><div className="scenario-list">{scenarios.map((s)=><article className="scenario-row" key={s.pair}><div className="scenario-symbol">↗</div><div className="scenario-info"><div><strong>{s.pair}</strong><span className="scenario-tag">{s.direction}</span></div><p>{s.note}</p></div><span className="scenario-time">{s.time}</span></article>)}<div className="scenario-footnote">ILLUSTRATIVE PLACEHOLDERS · NO LIVE DATA</div></div></div></section>

  <section className="closing-section wrap"><div className="closing-card"><div className="closing-orb"/><span className="eyebrow">BEGIN WITH A BETTER QUESTION</span><h2>Curiosity is a<br/><em>good first step.</em></h2><p>Explore the academy and find the learning path that fits your starting point.</p><Link className="button button-orange" href="/courses">Explore courses <MoveUpRight size={16}/></Link><span className="closing-mark">C</span></div></section>
  </main>; }
