import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {LockKeyhole} from "lucide-react";
import {CourseEnrollButton} from "@/components/course-enroll-button";
import {courseCatalog} from "@/lib/course-catalog";
import {createClient} from "@/lib/supabase/server";
import {createPageMetadata,jsonLdScript,SITE_NAME,SITE_URL} from "@/lib/seo";

export const dynamic="force-dynamic";

type CourseRecord={
  id:string;
  slug:string;
  title:string;
  short_description:string|null;
  full_description:string|null;
  price:number|null;
  currency:string;
  duration_label:string|null;
  is_published:boolean;
};

export async function generateMetadata({params}:{params:Promise<{courseId:string}>}):Promise<Metadata>{
  const {courseId}=await params;
  const db=await createClient();
  const {data:course}=db?await db.from("courses").select("title,slug,short_description,is_published").eq("id",courseId).is("archived_at",null).maybeSingle():{data:null};
  const fallback=courseCatalog.find(item=>item.id===courseId);
  const title=course?.title||fallback?.title;
  const description=course?.short_description||fallback?.tagline;
  const published=Boolean(course?.is_published||(!course&&fallback));
  return createPageMetadata({
    title:published&&title?`${title} — Currency Education Course`:"Course details",
    description:published?(description||`Explore ${title}, a financial markets education program from ${SITE_NAME}.`):"This course is not currently available for public enrollment.",
    path:`/courses/${courseId}`,
    index:published,
  });
}

export default async function CourseDetail({params}:{params:Promise<{courseId:string}>}){
  const {courseId}=await params;
  const db=await createClient();
  let user=null;
  let isAdmin=false;
  let databaseCourse:CourseRecord|null=null;

  if(db){
    const {data}=await db.auth.getUser();
    user=data.user;
    if(user){
      const {data:role}=await db.from("user_roles").select("user_id").eq("user_id",user.id).eq("role","admin").maybeSingle();
      isAdmin=Boolean(role);
    }
    let query=db.from("courses").select("id,slug,title,short_description,full_description,price,currency,duration_label,is_published").eq("id",courseId).is("archived_at",null);
    if(!isAdmin)query=query.eq("is_published",true);
    const {data}=await query.maybeSingle();
    databaseCourse=data as CourseRecord|null;
  }

  const fallback=courseCatalog.find(item=>item.id===courseId);
  if(!databaseCourse&&!fallback)notFound();
  const course:CourseRecord=databaseCourse||{
    id:fallback!.id,
    slug:fallback!.slug,
    title:fallback!.title,
    short_description:fallback!.tagline,
    full_description:[fallback!.tagline,...fallback!.outcomes.map(outcome=>`• ${outcome}`)].join("\n"),
    price:fallback!.price,
    currency:"INR",
    duration_label:fallback!.duration,
    is_published:true,
  };
  const catalogSynchronized=Boolean(databaseCourse?.is_published);
  const {data:activeEnrollment}=db&&user&&databaseCourse?await db.from("enrollments").select("id").eq("student_id",user.id).eq("course_id",course.id).eq("status","active").maybeSingle():{data:null};
  const descriptionLines=(course.full_description??"").split("\n").map(line=>line.trim()).filter(Boolean);
  const courseTagline=descriptionLines[0]&&!descriptionLines[0].startsWith("•")?descriptionLines[0]:null;
  const courseOutcomes=descriptionLines.filter(line=>line.startsWith("•")).map(line=>line.slice(1).trim());
  const courseSchema=course.is_published?{"@context":"https://schema.org","@type":"Course","@id":`${SITE_URL}/courses/${course.id}#course`,name:course.title,description:course.short_description||course.full_description||undefined,url:`${SITE_URL}/courses/${course.id}`,provider:{"@type":"Organization","@id":`${SITE_URL}/#organization`,name:SITE_NAME,url:SITE_URL}}:null;
  const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem",position:1,name:"Home",item:SITE_URL},{"@type":"ListItem",position:2,name:"Courses",item:`${SITE_URL}/courses`},{"@type":"ListItem",position:3,name:course.title}]};

  return <main className="page-main wrap">
    {courseSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(courseSchema)}}/>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript(breadcrumbSchema)}}/>
    <nav className="seo-breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/courses">Courses</Link></li><li aria-current="page">{course.title}</li></ol></nav>
    <div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · ACADEMY{course.duration_label?` · ${course.duration_label.toUpperCase()}`:""}</span><h1>{course.title}</h1><p>{course.short_description}</p></div>
    {isAdmin&&!course.is_published&&<div className="course-draft-notice"><strong>Draft preview</strong><span>Only administrators can see this course until you publish it in the course editor.</span></div>}
    {course.full_description&&<section className="course-detail-copy"><h2>What you’ll get</h2>{courseTagline&&<p className="course-tagline">{courseTagline}</p>}{courseOutcomes.length?<ul>{courseOutcomes.map(outcome=><li key={outcome}>{outcome}</li>)}</ul>:!courseTagline&&<p>{course.full_description}</p>}</section>}
    {(course.slug==="nism-certify"||course.slug==="corpenta-funded")&&<aside className="notice-box course-claims-note">{course.slug==="nism-certify"?<p>The exam module and certification requirements are pending confirmation. Course completion does not itself confer NISM certification.</p>:<p>Funding is not guaranteed. Eligibility, evaluation criteria, provider terms, fees and funding conditions are pending confirmation.</p>}</aside>}
    <div className="locked-panel">
      <div><strong><LockKeyhole size={16} style={{verticalAlign:"middle",marginRight:8}}/>{course.price===null?"Enrollment details are being prepared":`${course.currency} ${new Intl.NumberFormat("en-IN").format(Number(course.price))}`}</strong><p>{course.duration_label?`Duration: ${course.duration_label}. `:""}Course access is enabled after confirmed payment and active enrollment.</p></div>
      {activeEnrollment?<Link className="button button-dark" href="/student/my-courses">Go to my courses</Link>:catalogSynchronized&&course.price!==null?<CourseEnrollButton courseId={course.id}/>:<div className="course-enroll-unavailable"><strong>Enrollment is not open yet</strong><p>The course details are available; enrollment will open after the academy catalog is synchronized.</p><Link className="underlined-link" href="/contact">Contact the academy <LockKeyhole size={14}/></Link></div>}
    </div>
  </main>;
}
