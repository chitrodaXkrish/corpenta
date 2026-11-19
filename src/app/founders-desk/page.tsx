import Link from "next/link";
import Image from "next/image";
import {createPageMetadata, jsonLdScript, SITE_URL} from "@/lib/seo";

export const metadata=createPageMetadata({
  title:"Avanish Yadav, Founder and Financial Markets Educator",
  description:"Meet Avanish Yadav, Founder and CEO of Corpenta Global, and learn about his financial markets education experience, areas of expertise and global vision.",
  path:"/founders-desk",
  image:"/founder%27s%20desk/founder.png",
  imageWidth:888,
  imageHeight:1006,
  imageAlt:"Avanish Yadav, Founder and CEO of Corpenta Global",
});

const expertise=[
  {title:"Forex markets",copy:"Currency trading, technical analysis, market structure, and trading strategies."},
  {title:"Cryptocurrency markets",copy:"Digital asset markets, crypto trading, and market analysis."},
  {title:"Stock markets",copy:"Equity market fundamentals, technical analysis, and trading methodologies."},
  {title:"Trading education",copy:"Professional training programs, mentorship, and practical market learning."},
  {title:"Risk management",copy:"Capital protection, risk-reward frameworks, and trading discipline."},
  {title:"Business & leadership",copy:"Business operations, team management, strategic planning, and educational business development."},
];

const milestones=[
  {value:"10+ years",label:"Financial markets industry experience"},
  {value:"8+ years",label:"Financial market education & mentorship"},
  {value:"5,000–7,000+",label:"Individuals educated"},
  {value:"500+",label:"Offline educational seminars across India"},
  {value:"International",label:"Educational sessions in Dubai, Singapore, and other locations"},
];

export default function FoundersDeskPage(){
  const personSchema={"@context":"https://schema.org","@type":"Person","@id":`${SITE_URL}/founders-desk#avanish-yadav`,name:"Avanish Yadav",jobTitle:"Founder & CEO | Global Financial Markets Educator",image:`${SITE_URL}/founder%27s%20desk/founder.png`,worksFor:{"@id":`${SITE_URL}/#organization`},url:`${SITE_URL}/founders-desk`};
  return <main className="page-main wrap founders-desk-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(personSchema)}}/>
    <header className="founders-desk-heading">
      <span className="eyebrow">FOUNDER PROFILE</span>
      <div className="founders-profile-hero-main"><h1>Avanish<br/><em>Yadav.</em></h1><Image className="founders-profile-photo" src="/founder%27s%20desk/founder.png" alt="Avanish Yadav, Founder and CEO" width={888} height={1006} sizes="(max-width: 640px) 34vw, 300px" priority/></div>
      <p className="founders-desk-role">Founder &amp; CEO <span>·</span> Global Financial Markets Educator</p>
      <p>Empowering people through financial market knowledge, education &amp; leadership.</p>
    </header>

    <section className="founders-session-gallery" aria-labelledby="founder-gallery-title">
      <div className="founders-session-gallery-heading"><span className="eyebrow">IN PERSON · AROUND THE WORLD</span><h2 id="founder-gallery-title">Learning happens<br/>in <em>the room.</em></h2></div>
      <div className="founders-session-gallery-grid">
        <figure><Image src="/sessions/0a8f9ce5-6f53-4569-8fc8-69bb87df2eba.jpg" alt="A financial education seminar with attendees" width={1600} height={1066} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
        <figure><Image src="/sessions/4269c677-3105-431c-9ba0-8ce675ffa8e9.jpg" alt="Avanish speaking at an in-person seminar" width={1600} height={1200} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
        <figure><Image src="/sessions/9f9a00e7-7964-4c96-b538-7a5a4216f14d.jpg" alt="Avanish leading a seminar for attendees" width={1600} height={1200} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
        <figure><Image src="/sessions/IMG_0878.JPG" alt="A large audience at an educational session" width={3520} height={1980} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
        <figure><Image src="/sessions/IMG_5842.JPG" alt="Avanish sharing market education with a group" width={1280} height={853} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
        <figure><Image src="/sessions/IMG_3192.jpg" alt="Avanish at a financial markets education session" width={4032} height={2268} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>
      </div>
    </section>

    <section className="founders-profile-about" aria-labelledby="founder-about-title">
      <div className="founders-profile-section-label"><span>01</span><span>ABOUT THE FOUNDER</span></div>
      <div className="founders-profile-copy">
        <h2 id="founder-about-title">Education shaped<br/>by <em>experience.</em></h2>
        <div className="founders-profile-prose">
          <p>Avanish Yadav is a financial markets professional, entrepreneur, and global financial markets educator with over 10 years of experience in the financial markets industry.</p>
          <p>With a strong foundation in Forex, Cryptocurrency, and Stock Markets, he has dedicated more than 8 years to educating individuals and developing trading knowledge across domestic and international markets.</p>
          <p>Throughout his professional journey, Avanish has educated and mentored 5,000–7,000+ individuals, helping them understand financial markets, trading methodologies, market analysis, risk management, and trading psychology.</p>
          <p>His experience extends beyond individual education. He has conducted 500+ offline seminars across India, delivering financial market education to diverse audiences and building awareness about global trading opportunities.</p>
          <p>Avanish has also conducted international educational sessions and training engagements in countries including Dubai and Singapore, working with students and participants from different international backgrounds.</p>
          <p>In addition to his educational experience, he has supported business organizations with financial market initiatives and fund-management-related operations, bringing together market knowledge, business understanding, strategic thinking, and leadership capabilities.</p>
        </div>
      </div>
    </section>

    <section className="founders-profile-expertise" aria-labelledby="founder-expertise-title">
      <div className="founders-profile-section-label"><span>02</span><span>AREAS OF EXPERTISE</span></div>
      <div className="founders-profile-section-content">
        <h2 id="founder-expertise-title">A broad view<br/>of the <em>markets.</em></h2>
        <div className="founders-profile-expertise-grid">{expertise.map((item,index)=><article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </div>
    </section>

    <section className="founders-profile-milestones" aria-labelledby="founder-milestones-title">
      <div className="founders-profile-section-label"><span>03</span><span>PROFESSIONAL MILESTONES</span></div>
      <div className="founders-profile-section-content">
        <h2 id="founder-milestones-title">A journey of<br/><em>learning and reach.</em></h2>
        <div className="founders-profile-milestone-list">{milestones.map((item,index)=><article key={item.label}><span>{String(index+1).padStart(2,"0")}</span><strong>{item.value}</strong><p>{item.label}</p></article>)}</div>
      </div>
    </section>

    <section className="founders-profile-vision" aria-labelledby="founder-vision-title">
      <div className="founders-profile-section-label"><span>04</span><span>GLOBAL VISION</span></div>
      <div className="founders-profile-vision-copy">
        <h2 id="founder-vision-title">Make markets<br/>more <em>accessible.</em></h2>
        <p>Avanish believes that financial education is one of the most powerful tools for creating informed and confident individuals.</p>
        <p>His vision is to build a globally recognized financial education ecosystem that combines practical market knowledge, structured learning, professional mentorship, and responsible trading practices.</p>
        <p>Through continuous innovation, education, and leadership, he aims to make global financial markets more accessible to individuals who aspire to develop their understanding of Forex, Cryptocurrency, and Stock Markets.</p>
      </div>
    </section>

    <section className="founders-profile-philosophy" aria-labelledby="founder-philosophy-title">
      <div className="founders-profile-section-label"><span>05</span><span>HIS PHILOSOPHY</span></div>
      <div className="founders-profile-philosophy-copy">
        <h2 id="founder-philosophy-title">Knowledge.<br/>Discipline.<br/><em>Perspective.</em></h2>
        <blockquote>“Success in financial markets is not just about identifying opportunities. It is about developing knowledge, discipline, patience, and the ability to manage risk.”</blockquote>
        <p>Avanish Yadav <span>Founder &amp; CEO | Global Financial Markets Educator</span></p>
      </div>
    </section>

    <section className="founders-profile-contact"><div><h2>Begin with a<br/><em>better question.</em></h2><p>Explore the academy or contact the team for current program information.</p></div><div className="founders-desk-contact-actions"><Link className="button button-dark" href="/courses">Explore courses</Link></div></section>

    <p className="founders-desk-risk">Forex and leveraged trading involve substantial financial risk. Educational material is not personalized financial advice and does not guarantee profitability.</p>
  </main>;
}
