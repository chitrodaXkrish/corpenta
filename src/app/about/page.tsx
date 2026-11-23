import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Corpenta Global",
  description: "Learn about Corpenta Global’s mission to make financial education accessible, practical and meaningful.",
  path: "/about",
});

const pillars = [
  { title: "Financial literacy", copy: "Build practical understanding of money, saving, budgeting and financial planning." },
  { title: "Personal finance", copy: "Explore responsible money management and informed financial decision-making." },
  { title: "Global markets", copy: "Learn about financial markets and the economic context in which they operate." },
  { title: "Practical education", copy: "Learn through structured programs, workshops, seminars and digital formats." },
];

export default function AboutPage() {
  return <main className="page-main wrap" aria-labelledby="about-title">
    <header className="page-heading">
      <span className="eyebrow">ABOUT CORPENTA GLOBAL</span>
      <h1 id="about-title">Financial knowledge<br/><em>without borders.</em></h1>
      <p>Corpenta Global is focused on making financial education accessible, practical and meaningful for students, young professionals and individuals. We work to build financial literacy across the nation and share learning that reaches communities around the world.</p>
    </header>

    <section className="data-panel" aria-labelledby="about-purpose-title">
      <h2 id="about-purpose-title">Our purpose</h2>
      <p>We believe people should have access to the knowledge needed to understand money, personal finance and global financial markets. Our learning brings financial concepts closer to everyday decisions, while encouraging learners to understand risk and make responsible choices.</p>
      <p>Our work aims to bridge traditional education and practical financial knowledge through programs, institutional collaborations, workshops, seminars and digital learning.</p>
    </section>

    <section className="section-pad" aria-labelledby="about-pillars-title">
      <div className="section-kicker"><span>HOW WE SUPPORT LEARNERS</span></div>
      <h2 id="about-pillars-title">Four learning<br/><em>pillars.</em></h2>
      <div className="simple-grid">{pillars.map((pillar) => <article className="simple-card" key={pillar.title}><h3>{pillar.title}</h3><p>{pillar.copy}</p></article>)}</div>
    </section>

    <nav className="about-next-steps" aria-label="Explore Corpenta Global">
      <Link className="button button-dark" href="/founders-desk">Founder’s Desk <ArrowUpRight size={16}/></Link>
      <Link className="button button-orange" href="/courses">Explore courses <ArrowUpRight size={16}/></Link>
    </nav>
  </main>;
}
