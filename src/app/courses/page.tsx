import type {Metadata} from "next";
import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {createPageMetadata} from "@/lib/seo";
import {courseCatalog} from "@/lib/course-catalog";

export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{
  return createPageMetadata({
    title:"Currency and Financial Market Courses",
    description:"Browse Corpenta Global’s published learning programs in currency and financial markets. Course details, availability and enrollment information are maintained by the academy.",
    path:"/courses",
    index:true,
  });
}

export default async function CoursesPage(){
  return <main className="page-main wrap courses-page" data-market-scene="candles"><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY</span><h1>Find your place<br/>to <em>begin.</em></h1><p>Explore the academy’s published programs. Course information is maintained by the Corpenta Global team.</p></div>
    <div className="course-catalogue">{courseCatalog.map((course,index)=><article className="course-product-row" key={course.title}>
      <div className="course-product-identity"><span className="eyebrow">PROGRAM {String(index+1).padStart(2,"0")} <i>·</i> {course.duration.toUpperCase()}</span><h2>{course.title}</h2><p className="course-product-tagline">{course.tagline}</p><Link className="underlined-link" href={`/courses/${course.id}`}>Course details <ArrowUpRight size={15}/></Link></div>
      <div className="course-product-learning"><span className="course-product-label">WHAT YOU’LL LEARN</span><ul>{course.outcomes.map(outcome=><li key={outcome}><span aria-hidden="true">↗</span>{outcome}</li>)}</ul></div>
      <div className="course-product-purchase"><div><span className="course-product-label">PROGRAM FEE</span><strong>₹{course.price.toLocaleString("en-IN")}</strong><small>One-time payment</small></div><Link className="course-product-cta" href={`/courses/${course.id}`}>Enrol Now <ArrowUpRight size={16}/></Link></div>
    </article>)}</div>
    <aside className="notice-box course-claims-note"><strong>Important course information</strong><p>NISM course completion does not itself confer certification. The examination module, registration requirements and certification are determined by NISM and must be confirmed before enrollment. Corpenta Funded is an educational program; funding is not guaranteed. Eligibility, evaluation rules, provider terms, fees and funding conditions are awaiting confirmation and will be published before enrollment opens.</p></aside>
  </main>;
}
