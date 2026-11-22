import Image from "next/image";
import { Handshake, ShieldCheck, TrendingUp } from "lucide-react";
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
  { name: "Avanish Yadav", role: "Managing Director & Co-Founder", image: "/founder's desk/founder.png", position: "center 18%" },
  { name: "Ayten Garayeva", role: "Client Success & Social Media Manager" },
  { name: "VJ Sharma", role: "Head – Business Intelligence & Technology Lead" },
];

export default function AboutPage() {
  return <main className="about-screen" aria-labelledby="about-title">
    <section className="about-screen-hero">
      <div className="about-screen-heading"><span>The People Behind Corpenta</span><h1 id="about-title">Leadership Built On Trust<i>.</i></h1><p>Helping entrepreneurs build successful businesses across the UAE with<br/> experience, transparency and long-term partnership.</p></div>

      <div className="about-screen-shape" aria-hidden="true"/>
      <div className="about-screen-mission"><span className="about-screen-quote">“</span><p>Our mission is simple —</p><h2>To make your <em>UAE journey</em><br/>simpler, faster and<br/><em>successful.</em></h2><p className="about-screen-mission-copy">At Corpenta, we combine expertise with personalised support so you can focus on growing your business, while we handle the rest.</p><strong>Mohd Jameel</strong></div>

      <div className="about-screen-founder"><Image src="/mohd-jameel.webp" alt="Mohd Jameel, Founder and Chief Executive Officer" fill priority sizes="(max-width: 760px) 75vw, 390px"/></div>
      <div className="about-screen-nameplate"><span className="about-screen-mark">C</span><span><strong>Mohd Jameel</strong><small>Founder &amp; Chief Executive Officer</small></span></div>

      <div className="about-screen-benefits">{benefits.map(({icon: Icon,title,copy}) => <article key={title}><span><Icon size={20}/></span><div><strong>{title}</strong><small>{copy}</small></div></article>)}</div>
    </section>

    <section className="about-screen-team" aria-labelledby="leadership-team-title">
      <h2 id="leadership-team-title">Meet The Leadership Team</h2><span className="about-screen-team-rule"/>
      <div className="about-screen-team-grid">{team.map((member) => <article key={member.name}><div className={`about-screen-team-photo${member.image ? " has-image" : ""}`}>{member.image ? <Image src={member.image} alt={member.name} fill sizes="(max-width: 760px) 100vw, 260px" style={{objectPosition:member.position}}/> : <span aria-hidden="true"/>}</div><div><strong>{member.name}</strong><p>{member.role}</p></div></article>)}</div>
      <p className="about-screen-values">EXPERTISE <i/> TRANSPARENCY <i/> PARTNERSHIP <i/> SUCCESS</p>
    </section>
  </main>;
}
