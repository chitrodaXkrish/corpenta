import Link from "next/link";
import type {Metadata} from "next";
import {ArrowUpRight} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {createPageMetadata} from "@/lib/seo";

export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{
  const db=await createClient();
  const {count}=db?await db.from("courses").select("id",{count:"exact",head:true}).eq("is_published",true).is("archived_at",null):{count:0};
  return createPageMetadata({
    title:"Forex and Financial Market Courses",
    description:"Browse Corpenta Global’s published learning programs in forex and financial markets. Course details, availability and enrollment information are maintained by the academy.",
    path:"/courses",
    index:(count??0)>0,
  });
}

export default async function CoursesPage(){
  const db=await createClient();
  let isAdmin=false;
  if(db){const {data:{user}}=await db.auth.getUser();if(user){const {data:role}=await db.from("user_roles").select("user_id").eq("user_id",user.id).eq("role","admin").maybeSingle();isAdmin=!!role;}}
  let query=db?.from("courses").select("id,title,short_description,price,currency,duration_label,is_published").is("archived_at",null).order("sort_order").order("created_at");
  if(query&&!isAdmin)query=query.eq("is_published",true);
  const {data:courses}=query?await query:{data:null};
  return <main className="page-main wrap"><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY</span><h1>Find your place<br/>to <em>begin.</em></h1><p>Explore the academy’s published programs. Course information is maintained by the Corpenta Global team.</p></div>
    {courses?.length?<><div className="simple-grid">{courses.map((course,index)=><Link className="simple-card" href={`/courses/${course.id}`} key={course.id}><span className="eyebrow">PROGRAM {String(index+1).padStart(2,"0")}{course.duration_label?` · ${course.duration_label.toUpperCase()}`:""}</span>{isAdmin&&!course.is_published&&<span className="course-draft-preview">DRAFT · ADMIN PREVIEW</span>}<h2>{course.title}</h2><p>{course.short_description||"Course details will be shared by the academy."}</p><div className="course-bottom"><span>{course.price===null?"Enrollment details soon":`${course.currency} ${Number(course.price).toLocaleString()}`}</span><ArrowUpRight size={15}/></div></Link>)}</div></>:<div className="locked-panel"><div><strong>Courses are being prepared</strong><p>Published programs will appear here when they are ready for enrollment.</p></div></div>}
  </main>;
}
