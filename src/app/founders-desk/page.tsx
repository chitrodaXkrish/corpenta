import Link from "next/link";
import {ArrowUpRight,AudioLines,BookOpen,ChartNoAxesCombined,ShieldCheck} from "lucide-react";

const principles=[
  {number:"01",title:"Pure manual trading",icon:ChartNoAxesCombined,copy:"Develop the psychological discipline and technical skills to execute trades manually. No algorithms or bots—just independent market understanding."},
  {number:"02",title:"Financial literacy for India",icon:BookOpen,copy:"A curriculum designed to educate Indian students on wealth creation, global market dynamics and independent financial decision-making."},
  {number:"03",title:"Market mastery",icon:AudioLines,copy:"Study technical analysis across major currency pairs, including EUR/USD, AUD/CAD and USD/CAD, as well as spot gold (XAU/USD)."},
  {number:"04",title:"Advanced risk management",icon:ShieldCheck,copy:"Learn capital preservation approaches that focus on micro lots (0.01 lot size) and cent-account strategies to help minimize risk exposure."},
];

export default function FoundersDeskPage(){
  return <main className="page-main wrap founders-desk-page">
    <header className="founders-desk-heading">
      <h1>Feel the magic<br/>of <em>trading.</em></h1>
      <p>Meet Avanish Yadav, trader and trainer, and learn about the approach behind One Number Trading Academy (ONTA).</p>
    </header>

    <section className="founders-desk-founder" aria-labelledby="founder-name">
      <div className="founders-desk-founder-index"><span>01 / THE FOUNDER</span><span>ONTA · EST. IDENTITY AS PROVIDED</span></div>
      <div className="founders-desk-founder-copy">
        <span className="eyebrow">TRADER AND TRAINER</span>
        <h2 id="founder-name">Avanish<br/><em>Yadav.</em></h2>
        <p>“Hello, I am Avanish Yadav, a driving force behind One Number Trading Academy (ONTA). With extensive hands-on experience in Forex and commodity trading, I have developed a disciplined approach to navigating the global financial markets. My philosophy is simple: trading should be structured, data-driven, and transparent. At ONTA, I focus on transforming beginners into independent traders through live chart analysis, real-time market scenarios, and strict capital protection techniques.”</p>
        <span className="founders-desk-attribution">FOUNDER INTRODUCTION · SOURCE: ONTA PROFILE PDF</span>
      </div>
      <div className="founders-desk-founder-mark" aria-hidden="true">A<span>Y</span></div>
    </section>

    <section className="founders-desk-principles" aria-labelledby="founders-desk-principles-title">
      <div className="founders-desk-section-heading"><div><span className="eyebrow">THE LEARNING APPROACH</span><h2 id="founders-desk-principles-title">What you will<br/><em>learn at ONTA.</em></h2></div><p>As described in the academy profile: manual execution, financial literacy, market analysis and careful attention to capital preservation.</p></div>
      <div className="founders-desk-principle-list">{principles.map(item=>{const Icon=item.icon;return <article key={item.number}><span className="founders-desk-principle-number">{item.number}</span><div className="founders-desk-principle-title"><Icon size={19} strokeWidth={1.5}/><h3>{item.title}</h3></div><p>{item.copy}</p><ArrowUpRight className="founders-desk-principle-arrow" size={17}/></article>})}</div>
    </section>

    <section className="founders-desk-live">
      <div className="founders-desk-live-top"><span className="eyebrow">BOOTCAMPS · LIVE SESSIONS</span><span>LEARN THE PROCESS</span></div>
      <h2>Understand the concepts.<br/>Observe the market<br/><em>as it moves.</em></h2>
      <p>ONTA describes its approach as real-time market execution and hands-on mentorship. Through its bootcamps, students build a foundational understanding of markets. Regular live trading meetings then focus on current conditions, potential setups and manual trade execution, with the stated aim of helping students develop independent understanding.</p>
      <div className="founders-desk-live-foot"><span>ACADEMY DESCRIPTION · SOURCE: ONTA PROFILE PDF</span><span>Education only · no outcome is promised</span></div>
    </section>

    <section className="founders-desk-contact"><div><span className="eyebrow">CONTINUE THE CONVERSATION</span><h2>Begin with a<br/><em>better question.</em></h2><p>Explore the academy or contact the team for current program information.</p></div><div className="founders-desk-contact-actions"><Link className="button button-dark" href="/courses">Explore courses</Link><a className="underlined-link" href="mailto:avanish111yadav@gmail.com">Contact the founder <ArrowUpRight size={14}/></a></div></section>

    <p className="founders-desk-risk">Forex and leveraged trading involve substantial financial risk. Educational material is not personalized financial advice and does not guarantee profitability. The experience and approach above are presented as statements from the supplied academy profile and are not independently verified.</p>
  </main>;
}
