import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {LockKeyhole} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {createPageMetadata, jsonLdScript, SITE_NAME, SITE_URL} from "@/lib/seo";

export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{courseId:string}>}):Promise<Metadata>{
  const {courseId}=await params;
  const db=await createClient();
  const {data:course}=db?await db.from("courses").select("title,short_description,is_published").eq("id",courseId).is("archived_at",null).maybeSingle():{data:null};
  const published=!!course?.is_published;
  return createPageMetadata({
    title:published?`${course.title} — Forex Education Course`:"Course details",
    description:published?(course.short_description||`Explore ${course.title}, a financial markets education program from ${SITE_NAME}.`):"This course is not currently available for public enrollment.",
    path:`/courses/${courseId}`,
    index:published,
  });
}

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
  const courseSchema=course.is_published?{"@context":"https://schema.org","@type":"Course","@id":`${SITE_URL}/courses/${course.id}#course`,name:course.title,description:course.short_description||course.full_description||undefined,url:`${SITE_URL}/courses/${course.id}`,provider:{"@type":"Organization","@id":`${SITE_URL}/#organization`,name:SITE_NAME,url:SITE_URL}}:null;
  const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem",position:1,name:"Home",item:SITE_URL},{"@type":"ListItem",position:2,name:"Courses",item:`${SITE_URL}/courses`},{"@type":"ListItem",position:3,name:course.title}]};
  return <main className="page-main wrap">{courseSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(courseSchema)}}/>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(breadcrumbSchema)}}/><nav className="seo-breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/courses">Courses</Link></li><li aria-current="page">{course.title}</li></ol></nav><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY{course.duration_label?` · ${course.duration_label.toUpperCase()}`:""}</span><h1>{course.title}</h1><p>{course.short_description}</p></div>
    {isAdmin&&!course.is_published&&<div className="course-draft-notice"><strong>Draft preview</strong><span>Only administrators can see this course until you publish it in the course editor.</span></div>}
    {course.full_description&&<section className="course-detail-copy"><h2>About this course</h2><p>{course.full_description}</p></section>}
    <div className="locked-panel"><div><strong><LockKeyhole size={16} style={{verticalAlign:"middle",marginRight:8}}/>{course.price===null?"Enrollment details are being prepared":`${course.currency} ${Number(course.price).toLocaleString()}`}</strong><p>{course.duration_label?`Duration: ${course.duration_label}. `:""}Course access is enabled after confirmed payment and active enrollment.</p></div><Link className="button button-dark" href="/register">Register to enroll</Link></div>
  </main>;
}
