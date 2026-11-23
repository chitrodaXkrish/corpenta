import type {Metadata} from "next";
import {ArrowUpRight} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {createPageMetadata} from "@/lib/seo";

export const dynamic="force-dynamic";
const confirmedCourses=[
  {title:"MONEY CODE",duration:"2 Weeks",price:999,tagline:"Build Your Financial Foundation.",outcomes:["Understand money, income and expenses","Learn budgeting, saving and banking basics","Explore inflation, compound interest and financial goals"]},
  {title:"MONEY MINDSET",duration:"2 Weeks",price:4999,tagline:"Master Your Mind.",outcomes:["Understand the psychology and behaviour of money","Build positive financial habits and discipline","Improve emotional control and financial decision-making"]},
  {title:"CAPITAL SHIELD",duration:"2 Weeks",price:7999,tagline:"Protect Today. Grow Tomorrow.",outcomes:["Understand financial risk and risk-versus-reward","Learn capital protection, position sizing and stop-loss concepts","Explore drawdown control and risk management"]},
  {title:"CORPENTA WEALTH ARCHITECT",duration:"10 Weeks",price:24999,tagline:"Design Your Wealth Future.",outcomes:["Understand personal finance, wealth planning and investment fundamentals","Explore stocks, forex, commodities and global financial markets","Learn institutional trading concepts, market structure and liquidity","Develop market-analysis, portfolio-diversification and risk-management awareness"]},
  {title:"NISM CERTIFY",duration:"4 Weeks",price:19999,tagline:"Get Certified. Get Ahead.",outcomes:["Learn Indian financial-market structure and regulatory fundamentals","Study securities and investment products relevant to the selected module","Prepare with syllabus-based revision, practice questions and mock tests"]},
  {title:"CORPENTA FUNDED",duration:"8 Weeks",price:34999,tagline:"Learn. Qualify. Explore Funding.",outcomes:["Understand trading fundamentals, price action and technical analysis","Develop trading strategies, execution plans and trading discipline","Learn risk management, drawdown control and trading psychology","Understand proprietary trading evaluation models and practise through simulations"]},
  {title:"CRYPTO CODE",duration:"4 Weeks",price:9999,tagline:"Decode. Understand. Digital Assets.",outcomes:["Understand Bitcoin, Ethereum and blockchain fundamentals","Explore wallets, exchanges, tokens and DeFi basics","Learn crypto-market awareness, security and digital-asset risks"]},
];
export async function generateMetadata():Promise<Metadata>{
  const db=await createClient();
  const {count}=db?await db.from("courses").select("id",{count:"exact",head:true}).eq("is_published",true).is("archived_at",null):{count:0};
  return createPageMetadata({
    title:"Currency and Financial Market Courses",
    description:"Browse Corpenta Global’s published learning programs in currency and financial markets. Course details, availability and enrollment information are maintained by the academy.",
    path:"/courses",
    index:(count??0)>0,
  });
}

export default async function CoursesPage(){
  return <main className="page-main wrap courses-page" data-market-scene="candles"><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY</span><h1>Find your place<br/>to <em>begin.</em></h1><p>Explore the academy’s published programs. Course information is maintained by the Corpenta Global team.</p></div>
    <div className="course-catalogue">{confirmedCourses.map((course,index)=><article className="course-product-row" key={course.title}>
      <div className="course-product-identity"><span className="eyebrow">PROGRAM {String(index+1).padStart(2,"0")} <i>·</i> {course.duration.toUpperCase()}</span><h2>{course.title}</h2><p className="course-product-tagline">{course.tagline}</p></div>
      <div className="course-product-learning"><span className="course-product-label">WHAT YOU’LL LEARN</span><ul>{course.outcomes.map(outcome=><li key={outcome}><span aria-hidden="true">↗</span>{outcome}</li>)}</ul></div>
      <div className="course-product-purchase"><div><span className="course-product-label">PROGRAM FEE</span><strong>₹{course.price.toLocaleString("en-IN")}</strong><small>One-time payment</small></div><button className="course-product-cta" type="button" disabled aria-disabled="true">Enrol Now <ArrowUpRight size={16}/></button></div>
    </article>)}</div>
  </main>;
}
