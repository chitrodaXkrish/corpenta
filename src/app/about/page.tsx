import Image from "next/image";
import { Handshake, ShieldCheck, TrendingUp, BookOpen, Globe2, Compass, Sparkles } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Us",
  description: "Meet the people behind Corpenta and learn how we support entrepreneurs across the UAE.",
  path: "/about",
});

const benefits = [
  { icon: Handshake, title: "Trusted by Entrepreneurs", copy: "Across the Globe" },
  { icon: TrendingUp, title: "Business Growth", copy: "Is Our Priority" },
  { icon: ShieldCheck, title: "End-to-End Support", copy: "From Setup to Success" },
];

const team = [
  { name: "Mohd Jameel", role: "Co-Founder & Executive Director", image: "/mohd-jameel.webp", position: "center top" },
  { name: "Deepak Gaikwad", role: "Head of Business Development & Marketing", image: "/deepak.png", position: "center top" },
  { name: "Sumit Jogdand", role: "Head of IT & Digital Communications", image: "/sumit.png", position: "center top" },
];

export default function AboutPage() {
  return <main className="about-screen" aria-labelledby="about-title">
    <section className="about-screen-hero" data-center-burst>
      <div className="about-screen-heading"><span>The People Behind Corpenta</span><h1 id="about-title">Leadership Built On Trust<i>.</i></h1><p>Helping entrepreneurs build successful businesses across the UAE with<br/> experience, transparency and long-term partnership.</p></div>

      <div className="about-screen-shape" aria-hidden="true"/>
      <div className="about-screen-mission">
        <span className="about-screen-quote">OUR MISSION</span>
        <h2>Beyond education,<br/><em>towards empowerment.</em></h2>
        <p className="about-screen-mission-copy">We make financial knowledge practical, accessible and globally relevant—so people can make confident decisions in an evolving financial world.</p>
        <div className="about-screen-mission-grid">
          <article><BookOpen size={16}/><span><strong>Make finance clear</strong><small>Simplify complex concepts.</small></span></article>
          <article><Globe2 size={16}/><span><strong>Think globally</strong><small>Understand markets and institutions.</small></span></article>
          <article><Compass size={16}/><span><strong>Learn by doing</strong><small>Build practical trading skills.</small></span></article>
          <article><Sparkles size={16}/><span><strong>Choose responsibly</strong><small>Grow confidence with care.</small></span></article>
        </div>
        <strong className="about-screen-mission-tagline">Educate globally. Empower financially.</strong>
      </div>

      <div className="about-screen-founder"><Image src="/founder.png" alt="Avanish Yadav, Founder and Managing Director" fill priority sizes="(max-width: 760px) 75vw, 390px"/></div>
      <div className="about-screen-nameplate"><span><strong>Avanish Yadav</strong><small>Founder &amp; Managing Director</small></span></div>

      <div className="about-screen-benefits">{benefits.map(({icon: Icon,title,copy}) => <article key={title}><span><Icon size={20}/></span><div><strong>{title}</strong><small>{copy}</small></div></article>)}</div>
    </section>

    <section className="about-screen-team" data-center-burst aria-labelledby="leadership-team-title">
      <h2 id="leadership-team-title">Meet The Leadership Team</h2><span className="about-screen-team-rule"/>
      <div className="about-screen-team-grid">{team.map((member) => <article key={member.name}><div className={`about-screen-team-photo${member.image ? " has-image" : ""}`}>{member.image ? <Image src={member.image} alt={member.name} fill sizes="(max-width: 760px) 100vw, 260px" style={{objectPosition:member.position}}/> : <span aria-hidden="true"/>}</div><div><strong>{member.name}</strong><p>{member.role}</p></div></article>)}</div>
      <p className="about-screen-values">EXPERTISE <i/> TRANSPARENCY <i/> PARTNERSHIP <i/> SUCCESS</p>
    </section>
  </main>;
}
