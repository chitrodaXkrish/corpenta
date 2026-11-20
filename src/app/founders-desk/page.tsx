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
  {value:"50+",label:"Offline educational seminars across India"},
  {value:"International",label:"Educational sessions in Dubai, Singapore, and other locations"},
];

const recentlyUploadedSessions:{src:string;alt:string;width:number;height:number}[]=[
  {src:"/sessions/11757801-d849-453a-be04-c9fbdc3160a3.jpg",alt:"Attendees applaud during an in-person financial education session.",width:1600,height:1066},
  {src:"/sessions/469050323_556256587162020_103688542105115320_n.jpg",alt:"Attendees listen as an educator speaks at a seminar.",width:414,height:414},
  {src:"/sessions/469099495_556256430495369_5054417133126015039_n.jpg",alt:"A seminar audience follows a presentation from the front of the room.",width:414,height:414},
  {src:"/sessions/469235814_556256470495365_2892969306640324014_n.jpg",alt:"An educator speaks to attendees during a seminar.",width:414,height:414},
  {src:"/sessions/469237657_556256497162029_5777819565907551968_n.jpg",alt:"Attendees seated for an in-person financial education session.",width:414,height:414},
  {src:"/sessions/469351768_556256500495362_3748451148070726430_n.jpg",alt:"An educator walks the center aisle while speaking with attendees.",width:414,height:414},
  {src:"/sessions/469398456_556256220495390_1588049222564727968_n.jpg",alt:"A speaker presents to a seated seminar audience.",width:414,height:414},
  {src:"/sessions/469445964_556256230495389_3776649010904668728_n.jpg",alt:"An educator answers questions during a seminar.",width:414,height:414},
  {src:"/sessions/IMG_0831.jpg",alt:"A moment from an in-person Corpenta Global learning session.",width:4032,height:3024},
  {src:"/sessions/IMG_0943.JPG",alt:"A financial markets educator speaks to a large student audience.",width:3520,height:1980},
  {src:"/sessions/IMG_7455.jpg",alt:"A moment from an in-person Corpenta Global learning session.",width:4032,height:3024},
  {src:"/sessions/IMG_7456.jpg",alt:"A moment from an in-person Corpenta Global learning session.",width:4032,height:3024},
  {src:"/sessions/e672e6c9-b13d-430f-ad73-715b77c94370.jpg",alt:"A group presents a bouquet during a learning event.",width:899,height:1599},
  {src:"/sessions/fb11979c-9ca8-4070-86c2-abda6c5f044d.jpg",alt:"Educators gather for a group photograph after a learning event.",width:1600,height:718},
];

const offlineSeminars:{src:string;alt:string;width:number;height:number}[]=[
  {src:"/sessions/0a8f9ce5-6f53-4569-8fc8-69bb87df2eba.jpg",alt:"Attendees at an in-person financial education seminar.",width:1600,height:1066},
  {src:"/sessions/4269c677-3105-431c-9ba0-8ce675ffa8e9.jpg",alt:"Avanish speaking with an in-person audience.",width:1600,height:1200},
  {src:"/sessions/9f9a00e7-7964-4c96-b538-7a5a4216f14d.jpg",alt:"Avanish leading a seminar for attendees.",width:1600,height:1200},
  {src:"/sessions/IMG_0878.JPG",alt:"A large audience at an educational session.",width:3520,height:1980},
  {src:"/sessions/IMG_5842.JPG",alt:"Avanish sharing market education with a group.",width:1280,height:853},
  {src:"/sessions/IMG_3192.jpg",alt:"Avanish at a financial markets education session.",width:4032,height:2268},
  ...recentlyUploadedSessions,
];

const onlineSessions:{src:string;alt:string;width:number;height:number}[]=[
  {src:"/sessions/Zoomlive.jpeg",alt:"Participants attending an online financial education session.",width:1600,height:900},
  {src:"/sessions/zoomlive2.png",alt:"Attendees in a live online learning session.",width:1672,height:941},
  {src:"/sessions/zoomlive3.png",alt:"Participants joining a remote learning session.",width:1672,height:941},
  {src:"/sessions/zoomlive5.png",alt:"Online participants follow a lesson on market structure and higher highs and higher lows.",width:1672,height:941},
  {src:"/sessions/zoomlive6.png",alt:"Avanish leads a live online session with participants joining by video.",width:1672,height:941},
];

const seminarCityGroups=[
  {city:"Hyderabad",photos:["/sessions/4269c677-3105-431c-9ba0-8ce675ffa8e9.jpg","/sessions/9f9a00e7-7964-4c96-b538-7a5a4216f14d.jpg","/sessions/469050323_556256587162020_103688542105115320_n.jpg","/sessions/469099495_556256430495369_5054417133126015039_n.jpg","/sessions/469235814_556256470495365_2892969306640324014_n.jpg","/sessions/469237657_556256497162029_5777819565907551968_n.jpg","/sessions/469351768_556256500495362_3748451148070726430_n.jpg","/sessions/469398456_556256220495390_1588049222564727968_n.jpg","/sessions/469445964_556256230495389_3776649010904668728_n.jpg"]},
  {city:"Mumbai",photos:["/sessions/IMG_0831.jpg","/sessions/IMG_0878.JPG","/sessions/IMG_0943.JPG"]},
  {city:"Pune",photos:["/sessions/IMG_5842.JPG","/sessions/IMG_3192.jpg","/sessions/IMG_7455.jpg","/sessions/IMG_7456.jpg"]},
  {city:"Delhi",photos:["/sessions/0a8f9ce5-6f53-4569-8fc8-69bb87df2eba.jpg","/sessions/11757801-d849-453a-be04-c9fbdc3160a3.jpg","/sessions/e672e6c9-b13d-430f-ad73-715b77c94370.jpg","/sessions/fb11979c-9ca8-4070-86c2-abda6c5f044d.jpg"]},
];

export default function FoundersDeskPage(){
  const personSchema={"@context":"https://schema.org","@type":"Person","@id":`${SITE_URL}/founders-desk#avanish-yadav`,name:"Avanish Yadav",jobTitle:"Founder & CEO | Global Financial Markets Educator",image:`${SITE_URL}/founder%27s%20desk/founder.png`,worksFor:{"@id":`${SITE_URL}/#organization`},url:`${SITE_URL}/founders-desk`};
  return <main className="page-main wrap founders-desk-page" data-market-scene="network">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(personSchema)}}/>
    <header className="founders-desk-heading" id="home">
      <span className="eyebrow">FOUNDER PROFILE</span>
      <div className="founders-profile-hero-main"><h1>Avanish<br/><em>Yadav.</em></h1><Image className="founders-profile-photo" src="/founder%27s%20desk/founder.png" alt="Avanish Yadav, Founder and CEO" width={888} height={1006} sizes="(max-width: 640px) 34vw, 300px" priority/></div>
      <p className="founders-desk-role">Founder &amp; CEO <span>·</span> Global Financial Markets Educator</p>
      <p>Empowering people through financial market knowledge, education &amp; leadership.</p>
    </header>

    <section className="founders-session-gallery" id="sessions" data-market-scene="candles" aria-labelledby="founder-gallery-title">
      <div className="founders-session-gallery-heading"><span className="eyebrow">03 · SESSIONS CONDUCTED</span><h2 id="founder-gallery-title">Learning in<br/><em>every format.</em></h2></div>
      <section className="founders-session-group" aria-labelledby="founder-offline-title"><div className="founders-session-group-heading"><h3 id="founder-offline-title">Offline Seminars</h3><p>In-person seminars, workshops and learning events.</p></div>{seminarCityGroups.map((group)=><section className="founders-session-city" key={group.city} aria-labelledby={`founder-city-${group.city.toLowerCase()}`}><header className="founders-session-city-heading"><h3 id={`founder-city-${group.city.toLowerCase()}`}>{group.city}</h3></header><div className="founders-session-gallery-grid">{offlineSeminars.filter((session)=>group.photos.includes(session.src)).map((session)=><figure key={session.src}><Image src={session.src} alt={session.alt} width={session.width} height={session.height} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>)}</div></section>)}</section>
      <section className="founders-session-group" aria-labelledby="founder-online-title"><div className="founders-session-group-heading"><h3 id="founder-online-title">Online Sessions</h3><p>Live remote sessions with participants joining digitally.</p></div><div className="founders-session-gallery-grid">{onlineSessions.map((session)=><figure key={session.src}><Image src={session.src} alt={session.alt} width={session.width} height={session.height} sizes="(max-width: 760px) 33vw, (max-width: 1200px) 30vw, 360px" loading="lazy"/></figure>)}</div></section>
    </section>

    <section className="founder-live-sessions" aria-labelledby="founder-live-sessions-title">
      <div className="founder-live-sessions-intro">
        <span className="eyebrow">A GLOBAL LEARNING COMMUNITY</span>
        <h2 id="founder-live-sessions-title">Live sessions.<br/><em>Worldwide reach.</em></h2>
        <p>Founder-led live financial markets sessions are conducted across India and in international locations.</p>
      </div>
      <div className="founder-live-sessions-regions">
        <section className="founder-region-india" aria-labelledby="founder-live-india-title">
          <h3 id="founder-live-india-title">India</h3>
          <ul><li>Hyderabad</li><li>Mumbai</li><li>Nashik</li><li>Pune</li><li>Delhi</li><li>Lucknow</li></ul>
        </section>
        <section className="founder-region-international" aria-labelledby="founder-live-international-title">
          <h3 id="founder-live-international-title">International</h3>
          <ul><li>United Kingdom</li><li>Nigeria</li><li>Malaysia</li><li>Thailand</li><li>Dubai</li></ul>
        </section>
      </div>
    </section>

    <section className="founders-profile-milestones" id="impact" data-market-scene="ticker" aria-labelledby="founder-milestones-title">
      <div className="founders-profile-section-label"><span>04</span><span>ACHIEVEMENTS &amp; IMPACT</span></div>
      <div className="founders-profile-section-content">
        <h2 id="founder-milestones-title">A journey of<br/><em>learning and reach.</em></h2>
        <div className="founders-profile-milestone-list">{milestones.map((item,index)=><article key={item.label}><span>{String(index+1).padStart(2,"0")}</span><strong>{item.value}</strong><p>{item.label}</p></article>)}</div>
      </div>
    </section>

    <nav className="founders-profile-nav" aria-label="Founder profile sections">
      <a href="#home">Home</a><a href="#about">About</a><a href="#sessions">Sessions</a><a href="#impact">Impact</a><a href="#projects">Projects &amp; Activities</a><a href="#contact">Contact</a>
    </nav>

    <section className="founders-profile-about" id="about" aria-labelledby="founder-about-title">
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

    <section className="founders-profile-expertise" data-market-scene="pairs" aria-labelledby="founder-expertise-title">
      <div className="founders-profile-section-label"><span>02</span><span>AREAS OF EXPERTISE</span></div>
      <div className="founders-profile-section-content">
        <h2 id="founder-expertise-title">A broad view<br/>of the <em>markets.</em></h2>
        <div className="founders-profile-expertise-grid">{expertise.map((item,index)=><article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </div>
    </section>

    <section className="founders-profile-vision" data-market-scene="network" aria-labelledby="founder-vision-title">
      <div className="founders-profile-section-label"><span>03</span><span>MISSION &amp; VISION</span></div>
      <div className="founders-profile-vision-copy">
        <h2 id="founder-vision-title">Make markets<br/>more <em>accessible.</em></h2>
        <p>Avanish believes that financial education is one of the most powerful tools for creating informed and confident individuals.</p>
        <p>His vision is to build a globally recognized financial education ecosystem that combines practical market knowledge, structured learning, professional mentorship, and responsible trading practices.</p>
        <p>Through continuous innovation, education, and leadership, he aims to make global financial markets more accessible to individuals who aspire to develop their understanding of Forex, Cryptocurrency, and Stock Markets.</p>
      </div>
    </section>

    <section className="founders-profile-philosophy" data-market-scene="currencies" aria-labelledby="founder-philosophy-title">
      <div className="founders-profile-section-label"><span>04</span><span>HIS PHILOSOPHY</span></div>
      <div className="founders-profile-philosophy-copy">
        <h2 id="founder-philosophy-title">Knowledge.<br/>Discipline.<br/><em>Perspective.</em></h2>
        <blockquote>“Success in financial markets is not just about identifying opportunities. It is about developing knowledge, discipline, patience, and the ability to manage risk.”</blockquote>
        <p>Avanish Yadav <span>Founder &amp; CEO | Global Financial Markets Educator</span></p>
      </div>
    </section>

    <section className="founders-profile-activities" id="projects" aria-labelledby="founder-activities-title">
      <div className="founders-profile-section-label"><span>05</span><span>PROJECTS &amp; ACTIVITIES</span></div>
      <div className="founders-profile-section-content">
        <h2 id="founder-activities-title">Education put<br/>into <em>practice.</em></h2>
        <div className="founders-profile-activities-grid">
          <article><span>01</span><h3>Financial markets education</h3><p>Seminars, workshops and learning sessions focused on Forex, cryptocurrency and stock markets.</p></article>
          <article><span>02</span><h3>Student learning &amp; mentorship</h3><p>Education and mentorship for individuals learning market analysis, trading methods, risk management and trading psychology.</p></article>
          <article><span>03</span><h3>Online learning sessions</h3><p>Live remote sessions that extend founder-led financial education to online participants.</p></article>
          <article><span>04</span><h3>Market initiatives</h3><p>Experience supporting business organizations with financial market initiatives and fund-management-related operations.</p></article>
        </div>
      </div>
    </section>

    <section className="founders-profile-contact" id="contact" aria-labelledby="founder-contact-title"><div><span className="eyebrow">CONTACT &amp; COLLABORATION</span><h2 id="founder-contact-title">Begin with a<br/><em>better question.</em></h2><p>For course information, training enquiries and collaboration requests, contact the Corpenta Global team.</p></div><div className="founders-desk-contact-actions"><Link className="button button-dark" href="/contact">Send an enquiry</Link><Link className="button button-dark" href="/courses">Explore courses</Link></div></section>

    <p className="founders-desk-risk">Forex and leveraged trading involve substantial financial risk. Educational material is not personalized financial advice and does not guarantee profitability.</p>
  </main>;
}
