import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,LockKeyhole} from "lucide-react";
import {createClient} from "@/lib/supabase/server";

export const dynamic="force-dynamic";

export default async function CourseDetail({params}:{params:Promise<{courseId:string}>}){
  const {courseId}=await params;
  const db=await createClient();
  if(!db)notFound();
  const {data:{user}}=await db.auth.getUser();
  let isAdmin=false;
  if(user){const {data:role}=await db.from("user_roles").select("user_id").eq("user_id",user.id).eq("role","admin").maybeSingle();isAdmin=!!role;}
  let query=db.from("courses").select("id,title,short_description,full_description,price,currency,duration_label,is_published").eq("id",courseId).is("archived_at",null);
  if(!isAdmin)query=query.eq("is_published",true);
  const {data:course}=await query.maybeSingle();
  if(!course)notFound();
  return <main className="page-main wrap"><Link href="/courses" className="underlined-link"><ArrowLeft size={14}/> All courses</Link><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY{course.duration_label?` · ${course.duration_label.toUpperCase()}`:""}</span><h1>{course.title}</h1><p>{course.short_description}</p></div>
    {isAdmin&&!course.is_published&&<div className="course-draft-notice"><strong>Draft preview</strong><span>Only administrators can see this course until you publish it in the course editor.</span></div>}
    {course.full_description&&<section className="course-detail-copy"><h2>About this course</h2><p>{course.full_description}</p></section>}
    <div className="locked-panel"><div><strong><LockKeyhole size={16} style={{verticalAlign:"middle",marginRight:8}}/>{course.price===null?"Enrollment details are being prepared":`${course.currency} ${Number(course.price).toLocaleString()}`}</strong><p>{course.duration_label?`Duration: ${course.duration_label}. `:""}Course access is enabled after confirmed payment and active enrollment.</p></div><Link className="button button-dark" href="/register">Register to enroll <ArrowUpRight size={14}/></Link></div>
  </main>;
}
