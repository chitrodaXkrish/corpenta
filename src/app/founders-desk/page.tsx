import Link from "next/link";
import {ArrowUpRight} from "lucide-react";

export default function FoundersDeskPage(){
  return <main className="page-main wrap founders-desk-page">
    <div className="founders-desk-heading">
      <span className="eyebrow">CORPENTA GLOBAL · FOUNDERS DESK</span>
      <h1>Perspective for<br/><em>the long view.</em></h1>
      <p>A place for notes on market education, decision-making and the ideas behind Corpenta Global.</p>
    </div>
    <section className="founders-desk-note" aria-labelledby="founders-desk-note-title">
      <div className="founders-desk-note-meta"><span>FROM THE DESK</span><span>EDITORIAL NOTES</span></div>
      <div className="founders-desk-note-body"><span className="founders-desk-index">01</span><div><h2 id="founders-desk-note-title">The desk is being prepared.</h2><p>Founder introductions and original notes will appear here once the team has provided and approved them. No personal biographies, credentials or quotations are published without confirmation.</p><Link className="underlined-link" href="/about">Explore our approach <ArrowUpRight size={14}/></Link></div></div>
    </section>
    <div className="founders-desk-footer"><span>CLARITY · DISCIPLINE · HUMILITY</span><span>Market education, with perspective.</span></div>
  </main>;
}
